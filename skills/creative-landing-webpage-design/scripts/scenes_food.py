"""Example object scenes for food and drink businesses (cafe, ice cream, bakery).
A scene is a function q -> [distance array per material group]. q is an (N,3) array of model-space points.
Tools (from sdf.py): sph, ell, rcone (round cone / tapered capsule), rbox, torus, lathe (solid of revolution), smin/smax (smooth union / intersection).
Never call smin with k=0 (use np.minimum). Always view a 300 px preview before rendering the final size.
"""
from sdf import *
import numpy as np

def cup(q):
    """Latte in a ceramic cup on a saucer, with a foam heart."""
    wall=lathe(q,[(0,-0.40),(0.27,-0.40),(0.34,-0.34),(0.53,0.36),(0.53,0.40),(0.49,0.41),(0.47,0.36),(0.30,-0.26),(0,-0.26)],round_=0.012)
    ring=smax(torus(q,[0.60,0.03,0],0.17,0.048,axis=2),0.50-q[:,0],0.01)          # outer half of the handle ring
    saucer=lathe(q,[(0,-0.52),(0.62,-0.52),(0.80,-0.44),(0.84,-0.40),(0.62,-0.43),(0.34,-0.45),(0,-0.45)],round_=0.012)
    body=np.minimum(smin(wall,ring,0.03),saucer)
    coffee=lathe(q,[(0,0.215),(0.455,0.215),(0.455,0.245),(0,0.245)])
    hx=q[:,0]/0.34; hy=(-q[:,2]+0.17)/0.34                                      # heart tip points at the camera
    foam=smax(lathe(q,[(0,0.215),(0.455,0.215),(0.455,0.252),(0,0.252)]),heart2d(hx,hy)*0.34,0.004)
    return [body,coffee,foam]
CUP_MATS=[Mat('#FBF6EE',0.36,0.22,0.25,0.003),Mat('#6B3E26',0.50,0.18,0.35,0.004),Mat('#F7EAD6',0.62,0.08,0.35,0.004)]

def cone(q):
    """Two-scoop waffle cone with a cherry and a drip."""
    ang=np.arctan2(q[:,2],q[:,0])
    waffle=0.014*np.sin(ang*7+q[:,1]*15)*np.sin(ang*7-q[:,1]*15)
    cone_=rcone(q,[0,-1.05,0],[0,0.02,0],0.04,0.40)+waffle
    s1=smin(ell(q,[0,0.32,0],[0.46,0.40,0.46]),torus(q,[0,0.00,0],0.40,0.085,axis=1),0.05)
    s2=smin(ell(q,[0.02,0.86,0.0],[0.36,0.32,0.36]),torus(q,[0.02,0.62,0],0.31,0.07,axis=1),0.05)
    cherry=smin(sph(q,[0.02,1.25,0.0],0.11),rcone(q,[0.02,1.30,0],[0.12,1.52,0.0],0.012,0.012),0.01)
    return [cone_,s1,s2,cherry]
CONE_MATS=[Mat('#E2B073',0.75,0.05,0.4,0.020),Mat('#F2A3BC',0.60,0.12,0.5,0.014),Mat('#FFF1D6',0.60,0.12,0.5,0.014),Mat('#C2183C',0.30,0.5,0.2,0.0)]

def coldcup(q):
    """Takeaway iced-coffee cup: paper cup with a card sleeve, dome lid and a straw."""
    cupb=lathe(q,[(0,-0.90),(0.30,-0.90),(0.34,-0.86),(0.47,0.55),(0.47,0.62),(0,0.62)],round_=0.01)
    sleeve=lathe(q,[(0,-0.30),(0.425,-0.30),(0.482,0.34),(0,0.34)],round_=0.006)   # slightly proud of the cup so the colour reads
    lid=lathe(q,[(0,0.60),(0.50,0.60),(0.50,0.68),(0.46,0.70),(0.0,0.95)],round_=0.02)
    straw=rcone(q,[0.10,0.40,0],[0.30,1.55,0.0],0.045,0.045)
    return [cupb,sleeve,lid,straw]
COLD_MATS=[Mat('#FFFFFF',0.55,0.10,0.3,0.004),Mat('#B8672F',0.70,0.05,0.35,0.012),Mat('#FFFFFF',0.30,0.28,0.2,0.0),Mat('#E8506E',0.35,0.25,0.2,0.0)]

def bean(q):
    """A single coffee bean with its groove (decor)."""
    b=ell(q,[0,0,0],[0.55,0.40,0.34])
    slit=smax(np.abs(q[:,2]-0.07*np.sin(q[:,0]*4.2))-0.026,0.06-q[:,1],0.01)   # narrow slit near the top
    return [smax(b,-slit,0.02)]
BEAN_MATS=[Mat('#5A3220',0.55,0.18,0.4,0.01)]

SCENES={
 'cup':(cup,CUP_MATS,dict(R=1.0,rot=(38,-22,0),center=(0,0,0),kblend=0.004)),
 'cone':(cone,CONE_MATS,dict(R=1.45,rot=(6,-16,-8),center=(0,-0.2,0),kblend=0.004)),
 'coldcup':(coldcup,COLD_MATS,dict(R=1.3,rot=(8,-22,-6),center=(0,-0.28,0),kblend=0.004)),
 'bean':(bean,BEAN_MATS,dict(R=0.7,rot=(30,-25,20),center=(0,0,0),kblend=0.004)),
}
