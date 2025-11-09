import pandas as pd
import numpy as np
import joblib
import sys
import json
import os


# Load pre-trained model
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
try:
    mw_model = joblib.load(os.path.join(MODEL_DIR, "mw_catboost_model.pkl"))
    print("Malware model loaded successfully.")
except Exception as e:
    print(f"Error loading Malware model: {e}")

try:
    pw_model = joblib.load(os.path.join(MODEL_DIR, "password_model.pkl"))
    print("Password model loaded successfully.")
except Exception as e:
    print(f"Error loading Password model: {e}")

try:
    mitm_model = joblib.load(os.path.join(MODEL_DIR, "mitm_model.pkl"))
    print("MITM model loaded successfully.")
except Exception as e:
    print(f"Error loading MITM model: {e}")
def predict_attacks(csv_path):
    try:

        # Validate file path
        if not os.path.exists(csv_path):
            return json.dumps({"error": "File not found"})
        
        # Load the CSV file
        df = pd.read_csv(csv_path)

        # Validate required columns (example: 'feature1', 'feature2', etc.)
        required_columns = ['pslist.avg_handlers', 'dlllist.avg_dlls_per_proc',
       'handles.avg_handles_per_proc', 'handles.nevent', 'handles.nsection',
       'handles.nmutant', 'svcscan.nservices', 'svcscan.kernel_drivers',
       'svcscan.process_services', 'svcscan.shared_process_services','src_port', 'bidirectional_bytes', 'src2dst_bytes',
       'bidirectional_mean_ps', 'bidirectional_stddev_ps',
       'bidirectional_max_ps', 'dst2src_min_ps', 'src2dst_mean_piat_ms',
       'application_name', 'requested_server_name','sbytes', 'sttl', 'sload', 'dload', 'smean', 'ct_state_ttl',
       'ct_dst_src_ltm', 'ct_srv_dst', 'attack_cat']  # Replace with actual column names
        if not all(col in df.columns for col in required_columns):
            return json.dumps({"error": "Input file missing required columns"})

        # Ensure models are trained on the right columns
        mw_preds = mw_model.predict(df['pslist.avg_handlers', 'dlllist.avg_dlls_per_proc',
       'handles.avg_handles_per_proc', 'handles.nevent', 'handles.nsection',
       'handles.nmutant', 'svcscan.nservices', 'svcscan.kernel_drivers',
       'svcscan.process_services', 'svcscan.shared_process_services'])
        pw_preds = pw_model.predict(df['src_port', 'bidirectional_bytes', 'src2dst_bytes',
       'bidirectional_mean_ps', 'bidirectional_stddev_ps',
       'bidirectional_max_ps', 'dst2src_min_ps', 'src2dst_mean_piat_ms',
       'application_name', 'requested_server_name'])
        mitm_preds = mitm_model.predict(df['sbytes', 'sttl', 'sload', 'dload', 'smean', 'ct_state_ttl',
       'ct_dst_src_ltm', 'ct_srv_dst', 'attack_cat'])

        # Summarize results
        results = {
            "Malware Attacks": int(sum(mw_preds)),
            "Password Attacks": int(sum(pw_preds)),
            "MITM Attacks": int(sum(mitm_preds))
        }
        return json.dumps(results)

    except Exception as e:
        # Log the error to stderr
        print(f"Error: {str(e)}", file=sys.stderr)
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
    else:
        csv_file = sys.argv[1]
        print(predict_attacks(csv_file))
