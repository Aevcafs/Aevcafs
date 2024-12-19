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

// Referências aos elementos
const form = document.getElementById('form-registro');
const tabela = document.getElementById('tabela-registros').querySelector('tbody');
const btnRelatorioGeral = document.getElementById('gerar-relatorio');
const btnRelatorioFuncionario = document.getElementById('gerar-relatorio-funcionario');
const filtroFuncionario = document.getElementById('filtro-funcionario');

// Adicionar registro no Firebase
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const funcionario = document.getElementById('funcionario').value.trim();
    const horas = parseFloat(document.getElementById('horas').value);
    const data = document.getElementById('data').value;

    if (!funcionario || isNaN(horas) || !data) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    registrosRef.push({ funcionario, horas, data });
    form.reset();
});

// Listar registros do Firebase
function listarRegistros() {
    registrosRef.on('value', (snapshot) => {
        tabela.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const registro = childSnapshot.val();

            const row = tabela.insertRow();
            row.innerHTML = `
                <td>${registro.funcionario}</td>
                <td>${registro.horas}</td>
                <td>${registro.data}</td>
                <td>
                    <button class="deletar" data-key="${key}">Deletar</button>
                </td>
            `;
        });

        document.querySelectorAll('.deletar').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const key = e.target.dataset.key;
                registrosRef.child(key).remove();
            });
        });
    });
}

// Gera relatório em texto ou PDF
function gerarRelatorio(filtrarFuncionario = null) {
    registrosRef.once('value', (snapshot) => {
        let saldo = 0;
        let conteudo = `Relatório de Horas\n\n`;

        snapshot.forEach((childSnapshot) => {
            const registro = childSnapshot.val();

            if (!filtrarFuncionario || registro.funcionario === filtrarFuncionario) {
                saldo += registro.horas;
                conteudo += `Funcionário: ${registro.funcionario}, Horas: ${registro.horas}, Data: ${registro.data}\n`;
            }
        });

        conteudo += `\nSaldo Total: ${saldo} horas`;

        // Cria e baixa o relatório como PDF
        const blob = new Blob([conteudo], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${filtrarFuncionario || 'geral'}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Eventos para gerar relatórios
btnRelatorioGeral.addEventListener('click', () => gerarRelatorio());
btnRelatorioFuncionario.addEventListener('click', () => {
    const funcionario = filtroFuncionario.value.trim();
    gerarRelatorio(funcionario);
});

// Inicializa a listagem
listarRegistros();
