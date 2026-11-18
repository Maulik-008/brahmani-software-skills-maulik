#!/usr/bin/env python3
"""Render soft-lit, matte 3D object PNGs (transparent background) from signed-distance scenes.

  python render_objects.py --lib scenes_food --scenes cup,cone --size 820 --out images
  python render_objects.py --lib my_scenes   --scenes all       --size 300 --out preview     # fast preview first!

A scene library is a python file exposing SCENES = {name: (fn, [Mat,...], render_kwargs)}.
Always preview at --size 300 (seconds), look at the result, fix the shape, THEN render the final size.
Run each batch in the foreground inside a ~4 minute window; skip files that already exist (resumable).
"""
import argparse, importlib, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sdf import render
ap=argparse.ArgumentParser()
ap.add_argument('--lib',default='scenes_food'); ap.add_argument('--scenes',default='all')
ap.add_argument('--size',type=int,default=820); ap.add_argument('--out',default='images')
ap.add_argument('--force',action='store_true'); ap.add_argument('--budget',type=int,default=240,help='stop starting new renders after N seconds')
a=ap.parse_args()
lib=importlib.import_module(a.lib); S=lib.SCENES
names=list(S) if a.scenes=='all' else a.scenes.split(',')
os.makedirs(a.out,exist_ok=True); t0=time.time()
for n in names:
    out=os.path.join(a.out,n+'.png')
    if os.path.exists(out) and not a.force: print('skip',n); continue
    if time.time()-t0>a.budget: print('budget reached; run again to continue'); break
    fn,mats,kw=S[n]; t=time.time(); render(fn,mats,size=a.size,out=out,**kw); print(n,round(time.time()-t,1),'s',flush=True)
