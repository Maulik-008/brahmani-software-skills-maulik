#!/usr/bin/env python3
"""Compose rendered object PNGs into a still-life 'photo' (for frame heroes, banners, gallery tiles).

  python compose_scene.py --bg "#C9C2F0" --objects heart.png,neuron.png,knee.png --out still.jpg
        [--size 1920x1080] [--layout cluster|row|diagonal|center] [--light "#FFFFFF"] [--floor 0.62]

Adds a soft light pool, a horizon/floor tone, film grain, and contact plus long shadows so the objects sit on a surface.
"""
import argparse, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
ap=argparse.ArgumentParser(); ap.add_argument('--bg',default='#C9C2F0'); ap.add_argument('--objects',required=True); ap.add_argument('--out',default='still.jpg')
ap.add_argument('--size',default='1920x1080'); ap.add_argument('--layout',default='cluster'); ap.add_argument('--floor',type=float,default=0.62); ap.add_argument('--light',default='#FFFFFF'); ap.add_argument('--grain',type=float,default=0.035)
a=ap.parse_args(); W,H=map(int,a.size.split('x'))
hx=lambda h:np.array([int(h.lstrip('#')[i:i+2],16) for i in (0,2,4)],float)/255
bg=hx(a.bg); lt=hx(a.light)
yy,xx=np.mgrid[0:H,0:W]; u=xx/W; v=yy/H
img=np.ones((H,W,3))*bg
floor=a.floor; m=np.clip((v-floor)/0.06,0,1)[...,None]
img=img*(1-0.10*m)+(bg*0.86)*(0.10*m)                       # slightly darker floor
img=img*(1-0.0)+0.0
d=np.sqrt(((u-0.42)/0.55)**2+((v-0.35)/0.7)**2); pool=np.clip(1-d,0,1)[...,None]**1.6
img=img+(lt-bg)*pool*0.38                                   # soft light pool, top left of centre
vig=np.clip(1-(((u-0.5)/0.75)**2+((v-0.5)/0.85)**2),0,1)[...,None]**0.5
img=img*(0.82+0.18*vig)
img=np.clip(img+np.random.RandomState(3).normal(0,a.grain,(H,W,1)),0,1)
base=Image.fromarray((img*255).astype(np.uint8)).convert('RGBA')
files=a.objects.split(',')
LAY={'cluster':[(0.66,0.80,0.62),(0.40,0.84,0.46),(0.84,0.86,0.36),(0.22,0.88,0.30)],
     'row':[(0.25,0.82,0.5),(0.50,0.82,0.5),(0.75,0.82,0.5),(0.90,0.82,0.4)],
     'diagonal':[(0.30,0.70,0.45),(0.52,0.78,0.50),(0.75,0.86,0.55),(0.90,0.90,0.35)],
     'center':[(0.5,0.86,0.78),(0.2,0.88,0.34),(0.82,0.9,0.34),(0.35,0.9,0.25)]}[a.layout]
order=sorted(range(len(files)),key=lambda i:LAY[min(i,len(LAY)-1)][2])   # draw small first? draw by y so lower is in front
for i in sorted(range(len(files)),key=lambda i:LAY[min(i,len(LAY)-1)][1]):
    cx,by,hh=LAY[min(i,len(LAY)-1)]; ob=Image.open(files[i]).convert('RGBA'); sc=hh*H/ob.height; ob=ob.resize((max(1,int(ob.width*sc)),max(1,int(ob.height*sc))),Image.LANCZOS)
    x=int(cx*W-ob.width/2); y=int(by*H-ob.height)
    al=np.array(ob.getchannel('A')).astype(float)/255
    # long soft shadow (to the right and down) + tight contact shadow
    big=Image.new('L',(W,H),0); big.paste(Image.fromarray((al*255).astype(np.uint8)),(x+int(ob.width*0.10),y+int(ob.height*0.06)))
    sh=np.array(big.filter(ImageFilter.GaussianBlur(ob.height*0.045))).astype(float)/255*0.30
    con=Image.new('L',(W,H),0); ell=np.zeros((H,W)); ey=by*H-ob.height*0.012; ex=cx*W
    ell=np.exp(-(((xx-ex)/(ob.width*0.34))**2+((yy-ey)/(ob.height*0.035))**2)); sh=np.maximum(sh,ell*0.45)
    arr=np.array(base).astype(float); arr[...,:3]*=(1-sh[...,None]); base=Image.fromarray(arr.astype(np.uint8))
    base.alpha_composite(ob,(max(0,x),max(0,y)) ) if x>=0 and y>=0 else base.paste(ob,(x,y),ob)
base.convert('RGB').save(a.out,quality=90); print('saved',a.out,(W,H))
