import { useState } from 'react';
import { testFirebaseConnection, cleanupTestData, testFirestoreRules } from '../utils/firebaseTest';
import { Play, Database, Shield, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const FirebaseTestPanel = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          message: 'Error al ejecutar prueba',
          error: error.message 
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      key: 'connection',
      name: 'Conexión General',
      description: 'Prueba crear y leer citas en Firebase',
      icon: <Database className="w-5 h-5" />,
      function: testFirebaseConnection,
      color: 'blue'
    },
    {
      key: 'security',
      name: 'Reglas de Seguridad',
      description: 'Verifica las reglas de Firestore',
      icon: <Shield className="w-5 h-5" />,
      function: testFirestoreRules,
      color: 'purple'
    },
    {
      key: 'cleanup',
      name: 'Limpiar Datos de Prueba',
      description: 'Identifica y limpia datos de prueba',
      icon: <Trash2 className="w-5 h-5" />,
      function: cleanupTestData,
      color: 'red'
    }
  ];

  const getStatusIcon = (result) => {
    if (!result) return null;
    return result.success ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getColorClasses = (color, isLoading, result) => {
    if (isLoading) return 'bg-gray-100 border-gray-300';
    if (result?.success) return 'bg-green-50 border-green-200';
    if (result?.success === false) return 'bg-red-50 border-red-200';
    
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100'
    };
    return colors[color] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🔥 Panel de Pruebas Firebase
        </h2>
        <p className="text-gray-600">
          Usa este panel para verificar que Firebase esté configurado correctamente
        </p>
      </div>

      {/* Información de configuración */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Configuración Actual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Project ID:</span>
            <span className="ml-2 text-blue-600">{import.meta.env.VITE_FIREBASE_PROJECT_ID}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Auth Domain:</span>
            <span className="ml-2 text-blue-600">{import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}</span>
          </div>
        </div>
      </div>

      {/* Tests */}
      <div className="space-y-6">
        {tests.map((test) => {
          const isLoading = loading[test.key];
          const result = testResults[test.key];
          
          return (
            <div
              key={test.key}
              className={`border-2 rounded-lg p-6 transition-all duration-200 ${getColorClasses(test.color, isLoading, result)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg bg-${test.color}-100`}>
                      {test.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {test.name}
                    </h3>
                    {getStatusIcon(result)}
                  </div>
                  <p className="text-gray-600 mb-4">{test.description}</p>
                  
                  {result && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(result)}
                        <span className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                          {result.message}
                        </span>
                      </div>
                      
                      {result.details && (
                        <div className="text-sm text-gray-600 space-y-1">
                          {Object.entries(result.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {value?.toString()}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Error:</strong> {result.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => runTest(test.key, test.function)}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : `bg-${test.color}-500 hover:bg-${test.color}-600 text-white shadow-md hover:shadow-lg`
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Ejecutando...' : 'Ejecutar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón para ejecutar todas las pruebas */}
      <div className="mt-8 text-center">
        <button
          onClick={async () => {
            for (const test of tests) {
              await runTest(test.key, test.function);
              // Pequeña pausa entre pruebas
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }}
          disabled={Object.values(loading).some(Boolean)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Ejecutar Todas las Pruebas
        </button>
      </div>
    </div>
  );
};

export default FirebaseTestPanel;