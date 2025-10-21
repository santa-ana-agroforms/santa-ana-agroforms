@echo off
setlocal enabledelayedexpansion

echo ============================================
echo Santa Ana Agroforms - Secure Docker Build
echo ============================================
echo.

REM Verificar que existe .env.docker
if not exist ".env.docker" (
    echo ERROR: .env.docker no encontrado
    echo.
    echo Crea el archivo .env.docker con las variables necesarias:
    echo.
    echo VITE_API_BASE_URL=https://santa-ana-api.onrender.com
    echo VITE_API_MOBILE_URL=https://santaana-api-latest.onrender.com
    echo VITE_API_MOBILE_KEY
    echo.
    exit /b 1
)

echo Cargando variables desde .env.docker...
echo.

REM Cargar variables desde .env.docker
for /f "tokens=1,* delims==" %%a in (.env.docker) do (
    set "%%a=%%b"
)

REM Verificar variables
if "%VITE_API_BASE_URL%"=="" (
    echo ERROR: VITE_API_BASE_URL no definida
    exit /b 1
)
if "%VITE_API_MOBILE_URL%"=="" (
    echo ERROR: VITE_API_MOBILE_URL no definida
    exit /b 1
)
if "%VITE_API_MOBILE_KEY%"=="" (
    echo ERROR: VITE_API_MOBILE_KEY no definida
    exit /b 1
)

echo Variables cargadas correctamente
echo.

set IMAGE_NAME=mariogm45/santa-ana-frontend
set VERSION=latest

echo Selecciona una opcion:
echo 1) Build local (sin push)
echo 2) Build y push a Docker Hub
echo 3) Build, test local, y push
echo.
set /p option="Opcion [1-3]: "

if "%option%"=="1" goto build_only
if "%option%"=="2" goto build_and_push
if "%option%"=="3" goto build_test_push
echo ERROR: Opcion invalida
exit /b 1

:build_only
echo.
echo Building %IMAGE_NAME%:%VERSION%...
docker build ^
  --build-arg VITE_API_BASE_URL=%VITE_API_BASE_URL% ^
  --build-arg VITE_API_MOBILE_URL=%VITE_API_MOBILE_URL% ^
  --build-arg VITE_API_MOBILE_KEY=%VITE_API_MOBILE_KEY% ^
  -t %IMAGE_NAME%:%VERSION% .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build completado!
    echo.
    echo Para probar localmente:
    echo   docker run -d --name test-frontend -p 8080:80 %IMAGE_NAME%:%VERSION%
    echo   start http://localhost:8080
) else (
    echo ERROR: Build fallo
    exit /b 1
)
goto end

:build_and_push
echo.
echo Building %IMAGE_NAME%:%VERSION%...
docker build ^
  --build-arg VITE_API_BASE_URL=%VITE_API_BASE_URL% ^
  --build-arg VITE_API_MOBILE_URL=%VITE_API_MOBILE_URL% ^
  --build-arg VITE_API_MOBILE_KEY=%VITE_API_MOBILE_KEY% ^
  -t %IMAGE_NAME%:%VERSION% .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Pushing to Docker Hub...
    docker push %IMAGE_NAME%:%VERSION%
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo Build y push completados!
        echo Imagen: %IMAGE_NAME%:%VERSION%
    ) else (
        echo ERROR: Push fallo
        exit /b 1
    )
) else (
    echo ERROR: Build fallo
    exit /b 1
)
goto end

:build_test_push
echo.
echo Building %IMAGE_NAME%:%VERSION%...
docker build ^
  --build-arg VITE_API_BASE_URL=%VITE_API_BASE_URL% ^
  --build-arg VITE_API_MOBILE_URL=%VITE_API_MOBILE_URL% ^
  --build-arg VITE_API_MOBILE_KEY=%VITE_API_MOBILE_KEY% ^
  -t %IMAGE_NAME%:%VERSION% .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Testing locally...
    docker run -d --name test-frontend -p 8080:80 %IMAGE_NAME%:%VERSION%
    timeout /t 5 /nobreak > nul
    
    curl -f http://localhost:8080/health > nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Health check passed!
        docker stop test-frontend > nul 2>&1
        docker rm test-frontend > nul 2>&1
        
        echo.
        set /p push_confirm="Push a Docker Hub? (y/n): "
        if "!push_confirm!"=="y" (
            echo Pushing to Docker Hub...
            docker push %IMAGE_NAME%:%VERSION%
            if %ERRORLEVEL% EQU 0 (
                echo Push completado!
            ) else (
                echo ERROR: Push fallo
                exit /b 1
            )
        ) else (
            echo Push cancelado
        )
    ) else (
        echo ERROR: Health check fallo
        docker logs test-frontend
        docker stop test-frontend > nul 2>&1
        docker rm test-frontend > nul 2>&1
        exit /b 1
    )
) else (
    echo ERROR: Build fallo
    exit /b 1
)
goto end

:end
echo.
echo Proceso completado!