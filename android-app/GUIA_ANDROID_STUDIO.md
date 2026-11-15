# Guía paso a paso: Compilar "Mi Mejor Patita" en Android Studio (.APK)

Este directorio (`android-app/`) contiene el proyecto nativo completo en **Kotlin + XML (ViewBinding) + Room SQLite local + SharedPreferences** listo para abrir y compilar en Android Studio sin servidor externo.

---

## 1. Requisitos previos en tu computadora
1. **Android Studio** (versión Koala, Ladybug o superior).
2. **JDK 17** (Android Studio ya lo incluye por defecto en *Project Structure / Gradle JDK*).
3. **Android SDK 34** (se descarga automáticamente al abrir el proyecto si aún no lo tienes).

---

## 2. Cómo abrir el proyecto
1. Descarga o copia la carpeta `android-app/` completa en tu computadora.
2. Abre **Android Studio**.
3. Haz clic en **Open** (Abrir) y selecciona específicamente la carpeta **`android-app`** (no la carpeta raíz del proyecto web).
4. Espera entre 1 y 3 minutos mientras **Gradle Sync** descarga las dependencias (`Material 3`, `Room`, `Coroutines`, `KSP`).
   - Si Android Studio pregunta *Do you trust this project?*, selecciona **Trust Project**.
   - Si aparece una ventana para actualizar AGP o Gradle, puedes darle **Ignore / Later** (ya viene configurado con AGP `8.5.2` y Gradle `8.7`).

---

## 3. Cómo probarlo en un celular o emulador
### Opción A: En tu celular Android físico (USB)
1. En tu celular ve a **Ajustes > Acerca del teléfono** y toca **7 veces** en *Número de compilación* para activar las Opciones de desarrollador.
2. Entra a **Opciones de desarrollador** y activa **Depuración por USB**.
3. Conecta el celular por cable USB a la PC y acepta el aviso de confianza en la pantalla del teléfono.
4. En la barra superior de Android Studio selecciona tu celular y presiona el botón verde **Run (▶)**.

### Opción B: En el Emulador de Android Studio
1. Abre **Device Manager** (icono de teléfono a la derecha).
2. Crea o inicia un dispositivo virtual (ej. *Pixel 7 · API 34*).
3. Presiona **Run (▶)**.

---

## 4. Cómo generar el archivo instalable `.apk`
1. En el menú superior de Android Studio ve a:
   **`Build > Build Bundle(s) / APK(s) > Build APK(s)`**
2. Cuando termine la compilación, aparecerá una notificación abajo a la derecha con el enlace **`locate`**.
3. El archivo generado estará en:
   `android-app/app/build/outputs/apk/debug/app-debug.apk`
4. Copia ese archivo `app-debug.apk` a tu celular (por cable, Drive o WhatsApp) y tócalo para instalar la app.

---

## 5. Datos de acceso y funcionamiento local
- **Usuario de prueba precargado**: `tutor@ejemplo.com` / `clave123` (también puedes usar el botón *Autocompletar* en la pantalla de inicio de sesión o ingresar con cualquier correo válido para crear tu propio perfil local).
- **Servicios disponibles**: Exclusivamente **Baño (S/. 45.00)** y **Cita Médica (S/. 50.00)**.
- **Base de datos en el teléfono**: Todos los usuarios, mascotas (con su historial médico, alergias y vacunas) y citas se guardan de forma persistente en SQLite mediante **Room** (`mi_mejor_patita.db`). No requiere internet ni backend.
