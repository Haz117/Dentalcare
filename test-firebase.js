// Test de conexión Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgvIO7nGGewqMVYDIiCilkD3iJ-oO_hhU",
  authDomain: "dentalcare-3b2ef.firebaseapp.com",
  projectId: "dentalcare-3b2ef",
  storageBucket: "dentalcare-3b2ef.firebasestorage.app",
  messagingSenderId: "460784117282",
  appId: "1:460784117282:web:05baf6cb122cf824520c7b",
  measurementId: "G-K29EK328S2"
};

console.log('🔄 Iniciando prueba de conexión Firebase...');

try {
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  console.log('✅ Firebase inicializado correctamente');
  
  // Probar conexión escribiendo un documento
  const testDoc = {
    test: true,
    timestamp: new Date(),
    message: 'Prueba de conexión'
  };
  
  const docRef = await addDoc(collection(db, 'test'), testDoc);
  console.log('✅ Documento de prueba creado con ID:', docRef.id);
  
  // Probar conexión leyendo documentos
  const querySnapshot = await getDocs(collection(db, 'test'));
  console.log('✅ Documentos de prueba leídos:', querySnapshot.size);
  
  console.log('🎉 Firebase está funcionando correctamente!');
  
} catch (error) {
  console.error('❌ Error conectando con Firebase:', error);
  console.error('Código de error:', error.code);
  console.error('Mensaje:', error.message);
}