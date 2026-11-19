import http.server
import socketserver
import os
import sys

PORT = 5173

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    directory = os.path.dirname(os.path.abspath(__file__))
    os.chdir(directory)
    handler = MyHttpRequestHandler
    
    # Trouver un port disponible
    port = PORT
    server = None
    for p in range(PORT, PORT + 20):
        try:
            server = socketserver.TCPServer(("", p), handler)
            port = p
            break
        except OSError:
            continue

    if not server:
        print("Impossible de démarrer le serveur sur les ports testés.")
        sys.exit(1)

    print(f"\n=======================================================")
    print(f"  ORCA Déco CI - Front-End Intégration Mobile Money")
    print(f"  Projet L3 Génie Logiciel - IIT 2026-2027")
    print(f"=======================================================")
    print(f"  Serveur en cours d'exécution sur :")
    print(f"  👉 http://localhost:{port}")
    print(f"  Appuyez sur Ctrl+C pour arrêter le serveur.\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt du serveur.")
        server.server_close()

if __name__ == '__main__':
    main()
