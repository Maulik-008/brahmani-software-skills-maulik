import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

def nrm(v): return v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),1e-9)
def smin(a,b,k):
    h=np.clip(0.5+0.5*(b-a)/k,0,1); return b*(1-h)+a*h-k*h*(1-h)
def smax(a,b,k): return -smin(-a,-b,k)
def sph(p,c,r): return np.linalg.norm(p-np.array(c),axis=1)-r
def ell(p,c,rad):
    q=(p-np.array(c)); rad=np.array(rad)
    k0=np.linalg.norm(q/rad,axis=1); k1=np.linalg.norm(q/(rad*rad),axis=1)
    return k0*(k0-1.0)/np.maximum(k1,1e-6)
def rcone(p,a,b,r1,r2):
    a=np.array(a,float); b=np.array(b,float)
    ba=b-a; l2=float(ba@ba); rr=r1-r2; a2=l2-rr*rr; il2=1.0/l2
    pa=p-a; y=pa@ba; z=y-l2
    t=pa*l2-ba[None,:]*y[:,None]; x2=(t*t).sum(1)
    y2=y*y*l2; z2=z*z*l2; k=np.sign(rr)*rr*rr*x2
    c1=np.sqrt(x2+z2)*il2-r2; c2=np.sqrt(x2+y2)*il2-r1; c3=(np.sqrt(np.maximum(x2*a2*il2,0))+y*rr)*il2-r1
    return np.where(np.sign(z)*a2*z2>k,c1,np.where(np.sign(y)*a2*y2<k,c2,c3))
def rbox(p,c,b,r):
    q=np.abs(p-np.array(c))-np.array(b)
    return np.linalg.norm(np.maximum(q,0),axis=1)+np.minimum(np.max(q,axis=1),0)-r
def torus(p,c,R,r,axis=1):
    q=p-np.array(c)
    ax=[0,1,2]; ax.remove(axis)
    d=np.sqrt(q[:,ax[0]]**2+q[:,ax[1]]**2)-R
    return np.sqrt(d*d+q[:,axis]**2)-r
def rotm(rx=0,ry=0,rz=0):
    rx,ry,rz=np.radians([rx,ry,rz])
    Rx=np.array([[1,0,0],[0,np.cos(rx),-np.sin(rx)],[0,np.sin(rx),np.cos(rx)]])
    Ry=np.array([[np.cos(ry),0,np.sin(ry)],[0,1,0],[-np.sin(ry),0,np.cos(ry)]])
    Rz=np.array([[np.cos(rz),-np.sin(rz),0],[np.sin(rz),np.cos(rz),0],[0,0,1]])
    return Rz@Ry@Rx
_rng=np.random.RandomState(7); _G=_rng.rand(40,40,40)
def noise3(p,scale):
    q=(p*scale)%39.0
    return ndi.map_coordinates(_G,[q[:,0],q[:,1],q[:,2]],order=1,mode='wrap')

class Mat:
    def __init__(s,color,rough=0.55,spec=0.14,sss=0.25,bump=0.012,bump_scale=22,sheen=0.0): s.__dict__.update(locals())
def srgb(c): return np.where(c<=0.0031308,12.92*c,1.055*np.power(np.maximum(c,0),1/2.4)-0.055)
def lin(h):
    h=h.lstrip('#'); return (np.array([int(h[i:i+2],16) for i in (0,2,4)])/255.0)**2.2

def render(groups,mats,R=1.0,size=900,rot=(0,0,0),kblend=0.03,center=(0,0,0),key=(-0.55,0.75,0.65),exposure=1.0,bg_tint=(0.5,0.55,0.7),out='out.png',crop=True,steps=90,mix=0.012):
    Rm=rotm(*rot); Ri=Rm.T; ctr=np.array(center)
    def local(p): return (p-ctr)@Rm      # world->model (rotation applied to object)
    def field(p):
        q=local(p); ds=groups(q); d=ds[0]
        for x in ds[1:]: d=smin(d,x,kblend)
        return d
    def field_groups(p): return groups(local(p))
    D=6.0; S=R*1.12
    u,v=np.meshgrid(np.linspace(-1,1,size),np.linspace(1,-1,size))
    rd=nrm(np.stack([u.ravel()*S,v.ravel()*S,-np.full(u.size,D)],1)); ro=np.array([0,0,D])
    # sphere bound
    b=ro@rd.T; cc=ro@ro-(R*1.15)**2; disc=b*b-cc
    cand=np.where(disc>0)[0]
    t0=np.zeros(u.size); t0[cand]=-b[cand]-np.sqrt(disc[cand])
    t=t0.copy(); hit=np.zeros(u.size,bool); act=cand.copy()
    for i in range(steps):
        if act.size==0: break
        p=ro+rd[act]*t[act,None]
        d=field(p)
        h=d<0.0015*(1+t[act]*0.0)
        hit[act[h]]=True
        t[act]+=d*0.9
        out_of=t[act]>D+R*1.3
        keep=(~h)&(~out_of)
        act=act[keep]
    hi=np.where(hit)[0]
    img=np.zeros((u.size,3)); alpha=np.zeros(u.size)
    if hi.size:
        p=ro+rd[hi]*t[hi,None]
        e=0.0012
        k=np.array([[1,-1,-1],[-1,-1,1],[-1,1,-1],[1,1,1]],float)
        n=np.zeros_like(p)
        for kk in k: n+=kk*field(p+kk*e)[:,None]
        n=nrm(n)
        # micro bump
        gs=[mats[0].bump_scale]; 
        nz=np.stack([noise3(p,22)-0.5,noise3(p+11.3,22)-0.5,noise3(p+23.1,22)-0.5],1)
        # per-hit material weights
        gd=field_groups(p); W=np.stack(gd,1); W=np.exp(-(W-W.min(1,keepdims=True))/mix); W/=W.sum(1,keepdims=True)
        albedo=sum(W[:,i,None]*lin(m.color)[None,:] for i,m in enumerate(mats))
        rough=sum(W[:,i]*m.rough for i,m in enumerate(mats)); spec=sum(W[:,i]*m.spec for i,m in enumerate(mats))
        sss=sum(W[:,i]*m.sss for i,m in enumerate(mats)); bump=sum(W[:,i]*m.bump for i,m in enumerate(mats))
        n=nrm(n+nz*bump[:,None]*8)
        V=-rd[hi]
        # ambient occlusion
        ao=np.ones(len(hi)); sc=1.0
        for j in range(1,6):
            hh=0.012+0.05*j; dd=field(p+n*hh); ao-=(hh-dd)*sc*0.9; sc*=0.78
        ao=np.clip(ao,0,1)**1.3
        Lk=nrm(np.array(key)); Lf=nrm(np.array([0.8,0.2,0.6])); Lr=nrm(np.array([0.5,0.6,-0.7]))
        # soft shadow from key
        res=np.ones(len(hi)); tt=np.full(len(hi),0.02); po=p+n*0.01
        for j in range(26):
            dd=field(po+Lk*tt[:,None]); res=np.minimum(res,np.clip(7*dd/tt,0,1)); tt+=np.clip(dd,0.012,0.18)
            if (tt>3.0).all(): break
        res=res*res*(3-2*res)
        wrap=0.30
        ndl=np.clip((n@Lk+wrap)/(1+wrap),0,1)
        diff=ndl*(0.25+0.75*res)
        fill=np.clip((n@Lf+0.5)/1.5,0,1)
        # sky/ground ambient
        up=np.clip(n[:,1]*0.5+0.5,0,1)
        amb=0.30+0.16*up
        H=nrm(Lk+V); nh=np.clip((n*H).sum(1),0,1)
        expn=2.0/(rough**2+1e-3)
        spc=spec*(nh**np.clip(expn,6,60))*res*(0.6+0.4*np.clip((n@Lk),0,1))
        fres=(1-np.clip((n*V).sum(1),0,1))**3.0
        sssterm=sss*(1-ndl)**1.6*np.clip(n@Lk*0.4+0.6,0,1)
        sat=albedo/np.maximum(albedo.max(1,keepdims=True),1e-3)
        col=albedo*(amb[:,None]*ao[:,None]+1.05*diff[:,None]+0.22*fill[:,None]*ao[:,None])
        col+=sat*sssterm[:,None]*0.55*np.array([1.0,0.7,0.6])[None,:]*ao[:,None]
        col+=spc[:,None]*0.9
        rim=np.clip((n*nrm(Lr)).sum(1),0,1)**2*fres
        col+=rim[:,None]*0.20*np.array(bg_tint)[None,:]
        col=col*exposure
        col=np.clip(col/(1+0.18*col),0,None)*1.12      # gentle highlight roll-off
        img[hi]=srgb(np.clip(col,0,1)); alpha[hi]=1
    img=img.reshape(size,size,3); alpha=alpha.reshape(size,size)
    a=ndi.gaussian_filter(alpha,0.7)
    rgba=np.dstack([img,a])
    im=Image.fromarray((np.clip(rgba,0,1)*255).astype(np.uint8),'RGBA')
    if crop:
        bb=im.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox(); im=im.crop(bb)
        pad=int(max(im.size)*0.03); cv=Image.new('RGBA',(im.width+2*pad,im.height+2*pad),(0,0,0,0)); cv.paste(im,(pad,pad)); im=cv
    render.last=dict(size=size,bb=(bb if crop else (0,0,size,size)),pad=(pad if crop else 0),S=S,D=D,Rm=Rm,ctr=ctr,final=im.size)
    im.save(out); return im


# ---------------------------------------------------------------- extra tools (lathe, 2D shapes)
def poly2d(px,py,pts):
    """Signed distance (negative inside) to a closed 2D polygon. pts: list of (x,y). Vectorised over px,py."""
    pts=np.array(pts,float); n=len(pts); d=np.full(px.shape,1e9); s=np.ones(px.shape)
    for i in range(n):
        a=pts[i]; b=pts[(i+1)%n]; e=b-a; wx=px-a[0]; wy=py-a[1]
        t=np.clip((wx*e[0]+wy*e[1])/(e@e+1e-12),0,1); bx=wx-e[0]*t; by=wy-e[1]*t
        d=np.minimum(d,bx*bx+by*by)
        c1=py>=a[1]; c2=py<b[1]; c3=e[0]*wy>e[1]*wx
        flip=(c1&c2&c3)|((~c1)&(~c2)&(~c3)); s=np.where(flip,-s,s)
    return s*np.sqrt(d)
def lathe(q,profile,center=(0,0,0),round_=0.0):
    """Solid of revolution about the Y axis. profile: closed polygon of (radius, height) points (include the axis r=0 for solids,
    or draw a wall polygon for hollow things like cups). round_ rounds every edge."""
    c=np.array(center); x=q[:,0]-c[0]; z=q[:,2]-c[2]; y=q[:,1]-c[1]
    r=np.sqrt(x*x+z*z)
    return poly2d(r,y,profile)-round_
def heart2d(px,py):
    """2D heart (unit size, tip at origin pointing up the y axis). Negative inside."""
    x=np.abs(px); y=py
    a=np.sqrt((x-0.25)**2+(y-0.75)**2)-np.sqrt(2)/4
    d1=x*x+(y-1)**2; k=0.5*np.maximum(x+y,0); d2=(x-k)**2+(y-k)**2
    b=np.sqrt(np.minimum(d1,d2))*np.sign(x-y)
    return np.where(y+x>1,a,b)
