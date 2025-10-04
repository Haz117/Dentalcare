#!/bin/bash
# Script para verificar que la configuración de Firebase Authentication está funcionando

echo "🔄 Probando autenticación Firebase..."
echo "📍 Asegúrate de haber habilitado Email/Password en Firebase Console"
echo ""

cd "c:\Users\Hazel Jared Almaraz\Downloads\Dentista\consultorio-dental"
node test-auth.js

echo ""
echo "🔍 Si el test falla con 'auth/operation-not-allowed':"
echo "   1. Ve a Firebase Console > Authentication > Sign-in method"
echo "   2. Habilita 'Email/Password'"
echo "   3. Guarda los cambios"
echo "   4. Ejecuta este script nuevamente"