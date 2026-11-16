from sdf import *
import numpy as np
def ellr(q,c,rad,R):   # rotated ellipsoid
    return ell((q-np.array(c))@R+np.array(c),c,rad)
def chain(q,pts,r0,r1,k=0.02):
    d=None; n=len(pts)-1
    for i in range(n):
        ra=r0+(r1-r0)*i/n; rb=r0+(r1-r0)*(i+1)/n
        x=rcone(q,pts[i],pts[i+1],ra,rb); d=x if d is None else smin(d,x,k)
    return d
# ------------------------------------------------ SPINE
def spine(q):
    N=8; bones=None; discs=None
    for i in range(N):
        t=i/(N-1); y=-0.92+t*1.84
        x=0.09*np.sin(t*np.pi*1.6+0.4); z=0.05*np.sin(t*np.pi*1.0+0.7)
        sc=0.80+0.30*t; c=np.array([x,y,z])
        body=ell(q,c,[0.17*sc,0.062*sc,0.145*sc]); body=smin(body,rbox(q,c,[0.12*sc,0.045*sc,0.10*sc],0.05*sc),0.04*sc)
        ped=smin(rcone(q,c+[0.11*sc,0.01,-0.10*sc],c+[0.13*sc,0.02*sc,-0.24*sc],0.045*sc,0.04*sc),rcone(q,c+[-0.11*sc,0.01,-0.10*sc],c+[-0.13*sc,0.02*sc,-0.24*sc],0.045*sc,0.04*sc),0.02)
        ring=torus(q,c+[0,0.012*sc,-0.19*sc],0.10*sc,0.034*sc,axis=1)
        ring=smax(ring,-(q[:,2]-(c[2]-0.07*sc)),0.01)         # keep posterior half of the arch
        tp=smin(rcone(q,c+[0.13*sc,0.03*sc,-0.22*sc],c+[0.32*sc,0.05*sc,-0.27*sc],0.034*sc,0.022*sc),rcone(q,c+[-0.13*sc,0.03*sc,-0.22*sc],c+[-0.32*sc,0.05*sc,-0.27*sc],0.034*sc,0.022*sc),0.02)
        sp=rcone(q,c+[0,0.02*sc,-0.28*sc],c+[0,-0.12*sc,-0.56*sc],0.04*sc,0.022*sc)
        v=smin(smin(body,ped,0.05*sc),smin(ring,smin(tp,sp,0.03),0.03),0.04*sc)
        bones=v if bones is None else np.minimum(bones,v)
        if i<N-1:
            t2=(i+0.5)/(N-1); y2=-0.92+t2*1.84; x2=0.09*np.sin(t2*np.pi*1.6+0.4); z2=0.05*np.sin(t2*np.pi*1.0+0.7); s2=0.80+0.30*t2
            d=ell(q,[x2,y2,z2],[0.16*s2,0.040*s2,0.14*s2]); discs=d if discs is None else np.minimum(discs,d)
    return [bones,discs]
SPINE_MATS=[Mat('#EDE3D0',0.66,0.08,0.40,0.010),Mat('#8EA7CC',0.55,0.20,0.50,0.008)]
# ------------------------------------------------ KNEE
def knee(q):
    ang=np.radians(26); Rt=np.array([[np.cos(ang),np.sin(ang),0],[-np.sin(ang),np.cos(ang),0],[0,0,1]])
    piv=np.array([0.0,-0.02,0.0])
    qt=(q-piv)@Rt+piv      # lower leg rotated about the pivot
    # femur
    shaft=rcone(q,[-0.04,0.98,0],[0.0,0.22,0],0.15,0.27)
    c1=ell(q,[-0.20,0.03,0.04],[0.20,0.19,0.27]); c2=ell(q,[0.20,0.03,0.04],[0.20,0.19,0.27])
    fem=smin(smin(shaft,c1,0.12),c2,0.12)
    notch=ell(q,[0.0,-0.02,-0.02],[0.06,0.14,0.20]); fem=smax(fem,-notch,0.04)
    # tibia + fibula
    plateau=ell(qt,[0.0,-0.13,0.0],[0.32,0.07,0.25]); tshaft=rcone(qt,[0.0,-0.15,0.0],[0.03,-0.98,0],0.18,0.12)
    tub=sph(qt,[0.0,-0.30,0.18],0.075)
    tib=smin(smin(plateau,tshaft,0.10),tub,0.05)
    fib=smin(rcone(qt,[0.31,-0.25,-0.06],[0.33,-0.92,-0.06],0.055,0.04),sph(qt,[0.31,-0.23,-0.06],0.075),0.03)
    bone=np.minimum(np.minimum(fem,tib),fib)
    pat=ell(q,[0.0,0.00,0.33],[0.145,0.17,0.075]); 
    # cartilage on condyles, menisci
    def cart(cx): return smax(ell(q,[cx,0.03,0.04],[0.215,0.205,0.285]),(q[:,1]-(-0.05)),0.01)
    cartl=np.minimum(cart(-0.20),cart(0.20))
    def men(cx): 
        o=ell(qt,[cx,-0.065,0.0],[0.17,0.042,0.16]); i=ell(qt,[cx*0.45,-0.06,0.0],[0.085,0.08,0.09]); return smax(o,-i,0.03)
    mn=np.minimum(men(-0.17),men(0.17))
    return [bone,pat,cartl,mn]
KNEE_MATS=[Mat('#EDE3D0',0.66,0.08,0.40,0.010),Mat('#E6DAC6',0.60,0.10,0.40,0.010),Mat('#8FB0D8',0.45,0.22,0.55,0.006),Mat('#A9B8CF',0.55,0.12,0.45,0.008)]
# ------------------------------------------------ HEART
def heart(q):
    a=np.radians(-36); Rz=np.array([[np.cos(a),-np.sin(a),0],[np.sin(a),np.cos(a),0],[0,0,1]])
    lv=ellr(q,[0.14,-0.14,0.0],[0.46,0.74,0.42],Rz.T)
    rv=ellr(q,[-0.30,-0.06,0.22],[0.32,0.56,0.30],Rz.T)
    base=ell(q,[-0.04,0.36,-0.02],[0.56,0.26,0.38])
    ra=ell(q,[-0.50,0.36,-0.06],[0.21,0.27,0.21]); la=ell(q,[0.36,0.52,-0.24],[0.24,0.19,0.22])
    m=smin(smin(smin(lv,rv,0.12),base,0.14),smin(ra,la,0.05),0.09)
    aorta=chain(q,[[0.06,0.50,0.04],[0.08,0.78,0.06],[0.00,0.96,0.06],[-0.18,0.98,0.03],[-0.30,0.84,0.0]],0.11,0.09,0.02)
    pulm=chain(q,[[-0.16,0.46,0.28],[-0.12,0.66,0.26],[0.04,0.82,0.18],[0.20,0.86,0.08]],0.09,0.075,0.02)
    svc=chain(q,[[-0.50,0.46,-0.06],[-0.52,0.78,-0.06],[-0.52,0.98,-0.06]],0.08,0.08,0.02)
    pv=chain(q,[[0.46,0.52,-0.26],[0.70,0.56,-0.30]],0.06,0.055,0.02)
    ves=smin(smin(aorta,pulm,0.05),pv,0.04)
    lad=chain(q,[[0.02,0.40,0.40],[0.02,0.14,0.44],[0.10,-0.18,0.42],[0.22,-0.50,0.32],[0.32,-0.74,0.18]],0.020,0.013,0.01)
    rca=chain(q,[[-0.22,0.44,0.32],[-0.42,0.22,0.36],[-0.46,-0.04,0.34],[-0.36,-0.30,0.32]],0.020,0.015,0.01)
    return [m,ves,svc,np.minimum(lad,rca)]
HEART_MATS=[Mat('#DA5767',0.50,0.15,0.62,0.012),Mat('#E4857F',0.48,0.15,0.55,0.010),Mat('#6F8FC8',0.45,0.20,0.45,0.008),Mat('#A3283A',0.45,0.16,0.5,0.006)]
# ------------------------------------------------ NEURON
def neuron(q):
    rng=np.random.RandomState(3)
    soma=sph(q,[0,0,0],0.27)
    soma=smin(soma,sph(q,[0.12,0.12,0.14],0.17),0.1); soma=smin(soma,sph(q,[-0.14,-0.1,0.1],0.16),0.1)
    tubes=None
    def add(t,x): return x if t is None else smin(t,x,0.03)
    prim=[(-0.8,0.15),(-0.55,0.8),(0.05,0.9),(0.65,0.7),(0.85,0.0),(-0.85,-0.35),(0.7,-0.65)]
    for ang_x,ang_y in prim:
        d=np.array([ang_x,ang_y,0.25*rng.randn()]); d/=np.linalg.norm(d); a=d*0.22; mid=d*(0.62+0.1*rng.rand()); 
        tubes=add(tubes,rcone(q,a,mid,0.085,0.05))
        # two secondaries
        for s in (-1,1):
            ax=np.array([-d[1],d[0],0.0])*s; d2=d*0.6+ax*0.7+np.array([0,0,0.15*s]); d2/=np.linalg.norm(d2)
            e=mid+d2*(0.30+0.08*rng.rand()); tubes=add(tubes,rcone(q,mid,e,0.05,0.026))
            tubes=add(tubes,sph(q,e,0.034))
            d3=d2*0.6+d*0.5; d3/=np.linalg.norm(d3); e3=e+d3*0.18; tubes=add(tubes,rcone(q,e,e3,0.026,0.016)); tubes=add(tubes,sph(q,e3,0.028))
    soma=smin(soma,tubes,0.06)
    # axon with myelin beads
    ax=chain(q,[[0.0,-0.2,0.0],[0.08,-0.7,0.05],[0.22,-1.15,0.0],[0.30,-1.60,-0.05]],0.07,0.04,0.02)
    beads=None
    for i,(cx,cy,cz) in enumerate([(0.12,-0.88,0.03),(0.2,-1.12,0.0),(0.27,-1.38,-0.03)]):
        b=ell(q,[cx,cy,cz],[0.095,0.12,0.095]); beads=b if beads is None else np.minimum(beads,b)
    return [smin(soma,ax,0.05),beads]
NEURON_MATS=[Mat('#A08AF2',0.46,0.20,0.75,0.008),Mat('#D9CFFF',0.38,0.28,0.55,0.006)]
# ------------------------------------------------ BEAR
def bear(q):
    body=ell(q,[0,-0.48,0],[0.50,0.56,0.44])
    head=ell(q,[0,0.40,0.04],[0.47,0.43,0.43])
    ears=smin(sph(q,[-0.34,0.76,0.0],0.17),sph(q,[0.34,0.76,0.0],0.17),0.02)
    arms=smin(rcone(q,[-0.40,-0.10,0.08],[-0.62,-0.46,0.30],0.14,0.115),rcone(q,[0.40,-0.10,0.08],[0.62,-0.46,0.30],0.14,0.115),0.02)
    legs=smin(ell(q,[-0.30,-0.98,0.28],[0.21,0.17,0.29]),ell(q,[0.30,-0.98,0.28],[0.21,0.17,0.29]),0.02)
    main=smin(smin(smin(body,head,0.12),ears,0.06),smin(arms,legs,0.02),0.07)
    cream=smin(ell(q,[0,0.31,0.40],[0.20,0.15,0.13]),ell(q,[0,-0.42,0.36],[0.30,0.34,0.13]),0.02)
    cream=smin(cream,smin(ell(q,[-0.30,-1.00,0.52],[0.13,0.10,0.04]),ell(q,[0.30,-1.00,0.52],[0.13,0.10,0.04]),0.01),0.01)
    inner=smin(ell(q,[-0.34,0.76,0.12],[0.10,0.10,0.04]),ell(q,[0.34,0.76,0.12],[0.10,0.10,0.04]),0.01)
    dark=smin(smin(sph(q,[-0.16,0.50,0.40],0.05),sph(q,[0.16,0.50,0.40],0.05),0.005),ell(q,[0,0.37,0.53],[0.07,0.05,0.045]),0.01)
    return [main,cream,inner,dark]
def bear_mats(c,cream='#FFF1D8',inner='#F0A7A0'):
    return [Mat(c,0.85,0.03,0.40,0.030,bump_scale=30),Mat(cream,0.85,0.03,0.30,0.030),Mat(inner,0.8,0.03,0.4,0.02),Mat('#2A1B14',0.30,0.55,0.0,0.0)]
# ------------------------------------------------ BODY (artist mannequin)
def body(q):
    parts=[]
    parts.append(ell(q,[0,0.885,0.0],[0.095,0.125,0.105])); parts.append(rcone(q,[0,0.775,0],[0,0.695,0],0.040,0.052))
    parts.append(ell(q,[0,0.50,0.0],[0.175,0.205,0.115])); parts.append(ell(q,[0,0.215,0.0],[0.132,0.095,0.092])); parts.append(ell(q,[0,0.025,0.0],[0.178,0.105,0.118]))
    for s in (-1,1):
        parts.append(sph(q,[s*0.240,0.605,0],0.056)); parts.append(rcone(q,[s*0.258,0.585,0],[s*0.300,0.285,0],0.046,0.041))
        parts.append(sph(q,[s*0.302,0.280,0],0.046)); parts.append(rcone(q,[s*0.304,0.262,0],[s*0.337,0.010,0.01],0.041,0.031))
        parts.append(sph(q,[s*0.338,0.0,0.01],0.031)); parts.append(ell(q,[s*0.348,-0.085,0.014],[0.030,0.072,0.021]))
        parts.append(sph(q,[s*0.088,-0.070,0],0.062)); parts.append(rcone(q,[s*0.092,-0.095,0],[s*0.106,-0.480,0.01],0.076,0.058))
        parts.append(sph(q,[s*0.106,-0.495,0.01],0.060)); parts.append(rcone(q,[s*0.106,-0.515,0.01],[s*0.100,-0.895,0.0],0.053,0.036))
        parts.append(sph(q,[s*0.100,-0.905,0.0],0.037)); parts.append(ell(q,[s*0.100,-0.965,0.060],[0.040,0.029,0.095]))
    d=parts[0]
    for x in parts[1:]: d=smin(d,x,0.006)
    return [d]
BODY_MATS=[Mat('#ECE5DA',0.60,0.09,0.35,0.006)]
# ------------------------------------------------ CROSS & PILL
def cross(q):
    a=rbox(q,[0,0,0],[0.16,0.50,0.075],0.07); b=rbox(q,[0,0,0],[0.50,0.16,0.075],0.07); return [smin(a,b,0.04)]
CROSS_MATS=[Mat('#F3F5FA',0.50,0.14,0.30,0.005)]
def pill(q):
    h1=rcone(q,[-0.52,0,0],[-0.004,0,0],0.27,0.27); h1=smin(h1,sph(q,[-0.52,0,0],0.27),0.01)
    h2=rcone(q,[0.004,0,0],[0.52,0,0],0.27,0.27); h2=smin(h2,sph(q,[0.52,0,0],0.27),0.01)
    return [h1,h2]
PILL_MATS=[Mat('#F5F7FB',0.32,0.32,0.25,0.003),Mat('#E8586C',0.32,0.32,0.30,0.003)]
SCENES={
 'spine':(spine,SPINE_MATS,dict(R=1.0,rot=(8,152,0),center=(0,0,0),kblend=0.01)),
 'knee':(knee,KNEE_MATS,dict(R=1.25,rot=(8,-32,-20),center=(0,0.0,0),kblend=0.004)),
 'heart':(heart,HEART_MATS,dict(R=1.28,rot=(6,-28,0),center=(0,-0.1,0),kblend=0.01)),
 'neuron':(neuron,NEURON_MATS,dict(R=1.48,rot=(0,0,0),center=(0,0.33,0),kblend=0.01)),
 'bear':(bear,bear_mats('#F2C14E'),dict(R=1.12,rot=(2,-14,0),center=(0,0.1,0),kblend=0.006)),
 'body':(body,BODY_MATS,dict(R=1.05,rot=(0,-12,0),center=(0,0,0),kblend=0.01)),
 'cross':(cross,CROSS_MATS,dict(R=0.62,rot=(14,-24,0),center=(0,0,0),kblend=0.01)),
 'pill':(pill,PILL_MATS,dict(R=0.66,rot=(18,-10,-32),center=(0,0,0),kblend=0.003,mix=0.0025)),
}
