import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "horas-extras-b5e4b.firebaseapp.com",
    databaseURL: "https://horas-extras-b5e4b-default-rtdb.firebaseio.com",
    projectId: "horas-extras-b5e4b",
    storageBucket: "horas-extras-b5e4b.appspot.com",
    messagingSenderId: "SUA_MESSAGING_ID",
    appId: "SUA_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const registrosRef = database.ref('registros');

// Adicionar registro (exemplo)
function adicionarRegistro(dados) {
    registrosRef.push(dados);
}

// Inicialização do Realtime Database
const database = getDatabase(app);

// Função para salvar dados no Realtime Database
function saveData(key, value) {
    const dbRef = ref(database, `example/${key}`);
    set(dbRef, { value })
        .then(() => {
            console.log('Data saved successfully.');
        })
        .catch((error) => {
            console.error('Error saving data:', error);
        });
}

// Função para buscar dados do Realtime Database
function fetchData() {
    const dbRef = ref(database);
    get(child(dbRef, 'example/'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById('output').innerText = JSON.stringify(data, null, 2);
            } else {
                console.log('No data available.');
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

// Lida com o envio do formulário
document.getElementById('dataForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário
    const key = document.getElementById('key').value;
    const value = document.getElementById('value').value;
    saveData(key, value);
});

// Lida com o clique no botão de buscar dados
document.getElementById('fetchDataButton').addEventListener('click', fetchData);
