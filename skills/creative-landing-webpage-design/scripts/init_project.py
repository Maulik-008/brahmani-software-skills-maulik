#!/usr/bin/env python3
"""Create a working folder for a new site:   python init_project.py my-cafe
Copies the example config, makes images/, and prints the next steps."""
import os, shutil, sys
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE)
name=sys.argv[1] if len(sys.argv)>1 else 'my-site'
os.makedirs(os.path.join(name,'images'),exist_ok=True)
shutil.copy(os.path.join(ROOT,'assets/scaffold/site.config.example.json'),os.path.join(name,'site.config.json'))
print(f'''Created {name}/
  1. Edit {name}/site.config.json  (every field is documented in references/06-build-architecture.md)
  2. Put hero object PNGs in {name}/images/  (render them: python {HERE}/render_objects.py --lib <scene file> --out {name}/images)
  3. python {HERE}/build_site.py {name}/site.config.json {name}/site.html
  4. python {HERE}/test_site.py {name}/site.html --out {name}/qa      (then LOOK at the screenshots)''')
