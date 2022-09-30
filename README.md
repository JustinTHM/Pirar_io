
# Pirar.io


Zuerst muss man sich per ssh mit dem Server verbinden mithilfe von Powershell oder einem anderen Terminal .
Da das hier öffentlich ist stehen die Login Daten nur in den Abgegebenen Dokumenten.

Sobald die Verbindung steht kann mit cd der Projekt Ordner geöffnet werden 
```
cd projekt 
```
 

Mit  ```ls –a –l ``` können alle Ordner und Dateien angezeigt werden. 


# Spiel Server starten: 

Beim Compilen fasst Webpack alle js und css Dateien zusammen und packt eine Cash Version davon in den /dist Ordner (Kann übersprungen werden) 
```
npm run build 
```
 

Wir starten den Server mit: 
```
npm run start 
```
 

Alternativ dazu kann der Server im development Modus gestartet werden. So wird bei Datei Veränderung der code neu geladen und der Server neu gestartet. 

 
```
export NODE_OPTIONS=--openssl-legacy-provider && npm run develop --openssl-legacy-provider 
```
( Der erste Teil ist ein Hotfix da wir es nicht auf dem localhost starten) 

 

Der Server läuft in jedem Modus nur solange das Terminal offen ist. Falls man den Server 24/7 Laufen lassen will könnte man das mit dem npm packet forever verwirklichen. Dieses startet nodejs Programm automatische neu falls der Prozess nicht läuft. Spielurl & Port: http://89.163.254.5:3000/ 

 
