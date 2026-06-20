import os
import hashlib
import json
import urllib.request
import urllib.error

TOKEN = os.environ.get("VERCEL_TOKEN")
PROJECT_ID = "prj_AIGSPfQ0GxJIPEuSsy9dTtmdODWv"
TEAM_ID = "team_orgFOB46WSk92X4TjpcRnGsX"
DIST_DIR = "./dist"

def calculate_sha1(filepath):
    sha1 = hashlib.sha1()
    with open(filepath, 'rb') as f:
        while True:
            data = f.read(65536)
            if not data:
                break
            sha1.update(data)
    return sha1.hexdigest()

def upload_file(filepath, sha1, size):
    url = f"https://api.vercel.com/v2/files?teamId={TEAM_ID}"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "x-now-digest": sha1,
        "x-now-size": str(size),
        "Content-Type": "application/octet-stream"
    }
    
    with open(filepath, 'rb') as f:
        file_data = f.read()
        
    req = urllib.request.Request(url, data=file_data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            print(f"Uploaded {filepath} successfully.")
            return True
    except urllib.error.HTTPError as e:
        print(f"Failed to upload {filepath}: {e.code} {e.reason}")
        print(e.read().decode())
        return False
    except Exception as e:
        print(f"Error uploading {filepath}: {e}")
        return False

def trigger_deployment(deployment_files):
    url = f"https://api.vercel.com/v13/deployments?teamId={TEAM_ID}"
    payload = {
        "name": "ergo-safe-reborn",
        "files": [
            {
                "file": f["file"],
                "sha": f["sha"],
                "size": f["size"]
            } for f in deployment_files
        ],
        "projectSettings": {
            "framework": None
        },
        "target": "production"
    }
    
    data = json.dumps(payload).encode('utf-8')
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            resp_body = res.read().decode('utf-8')
            return json.loads(resp_body), None
    except urllib.error.HTTPError as e:
        resp_body = e.read().decode('utf-8')
        try:
            err_json = json.loads(resp_body)
            return None, err_json
        except Exception:
            return None, {"error": {"code": "unknown", "message": resp_body}}
    except Exception as e:
        return None, {"error": {"code": "exception", "message": str(e)}}

def main():
    print("Preparing deployment files...")
    deployment_files = []
    
    # 1. Add compiled files from dist/
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, DIST_DIR).replace('\\', '/')
            sha1 = calculate_sha1(full_path)
            size = os.path.getsize(full_path)
            
            deployment_files.append({
                "local_path": full_path,
                "file": rel_path,
                "sha": sha1,
                "size": size
            })
            
    # 2. Add vercel.json for routing from root
    if os.path.exists("vercel.json"):
        sha1 = calculate_sha1("vercel.json")
        size = os.path.getsize("vercel.json")
        deployment_files.append({
            "local_path": "vercel.json",
            "file": "vercel.json",
            "sha": sha1,
            "size": size
        })
    else:
        print("WARNING: vercel.json not found in root directory!")
        
    print(f"Found {len(deployment_files)} files to deploy.")
    
    # 3. Try to trigger deployment first to check for missing files (Vercel API optimization)
    print("Sending pre-deployment request to Vercel to identify missing files...")
    response, err = trigger_deployment(deployment_files)
    
    if err:
        err_detail = err.get("error", {})
        if err_detail.get("code") == "missing_files":
            missing_shas = err_detail.get("missing", [])
            print(f"Vercel is missing {len(missing_shas)} files. Starting uploads...")
            
            # Find and upload only files that match missing SHAs
            for file_info in deployment_files:
                if file_info["sha"] in missing_shas:
                    print(f"Uploading missing file: {file_info['file']} ({file_info['size']} bytes)...")
                    success = upload_file(file_info['local_path'], file_info['sha'], file_info['size'])
                    if not success:
                        print("Aborting deployment due to file upload failure.")
                        return
            
            # Retry deployment triggering
            print("Re-triggering deployment...")
            response, err = trigger_deployment(deployment_files)
            if err:
                print(f"Failed to deploy on retry: {err}")
                return
        else:
            print(f"Failed to trigger deployment: {err}")
            return
            
    if response:
        print("\nDeployment completed successfully!")
        print(f"Deployment ID: {response.get('id')}")
        print(f"Deployment URL: https://{response.get('url')}")
        print(f"Production URL: https://ergo-safe-reborn.vercel.app")

if __name__ == "__main__":
    main()
