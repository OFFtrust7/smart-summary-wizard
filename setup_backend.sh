
#!/bin/bash
echo "Setting up virtual environment..."
python -m venv venv
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Setup complete! You can now run the backend with:"
echo "source venv/bin/activate"
echo "python backend_server.py"
