"""More example scenes: gym and wellness objects. Same contract as scenes_food.py."""
from sdf import *
import numpy as np
def dumbbell(q):
    bar=rcone(q,[-0.62,0,0],[0.62,0,0],0.075,0.075)
    plates=None
    for s in (-1,1):
        for (x,r,w) in [(0.52,0.42,0.09),(0.66,0.34,0.07)]:
            p=lathe(np.stack([q[:,1],q[:,0]-s*x,q[:,2]],1),[(0,-w),(r,-w),(r,w),(0,w)],round_=0.025)
            plates=p if plates is None else np.minimum(plates,p)
    grip=rcone(q,[-0.3,0,0],[0.3,0,0],0.10,0.10)
    return [np.minimum(bar,plates),grip]
DUMB_MATS=[Mat('#2B2B30',0.45,0.18,0.1,0.004),Mat('#E4572E',0.7,0.05,0.2,0.01)]
def kettlebell(q):
    body=sph(q,[0,-0.12,0],0.52); base=lathe(q,[(0,-0.62),(0.30,-0.62),(0.40,-0.55),(0,-0.55)],round_=0.02)
    handle=torus(q,[0,0.42,0],0.30,0.075,axis=2); handle=smax(handle,-(q[:,1]-0.20),0.02)
    return [smin(smin(body,base,0.06),handle,0.05)]
KB_MATS=[Mat('#1F1F24',0.5,0.16,0.1,0.006)]
SCENES={'dumbbell':(dumbbell,DUMB_MATS,dict(R=1.15,rot=(18,-28,10),center=(0,0,0),kblend=0.004)),
        'kettlebell':(kettlebell,KB_MATS,dict(R=1.1,rot=(10,-20,0),center=(0,0.1,0),kblend=0.004))}
