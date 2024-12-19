// Seleciona os elementos da página
const form = document.getElementById('form-registro');
const tabela = document.getElementById('tabela-registros').querySelector('tbody');
const btnRelatorioGeral = document.getElementById('gerar-relatorio');
const btnRelatorioFuncionario = document.getElementById('gerar-relatorio-funcionario');
const filtroFuncionario = document.getElementById('filtro-funcionario');

// Recupera os registros do localStorage ou inicializa vazio
let registros = JSON.parse(localStorage.getItem('registros')) || [];

// Função para salvar no localStorage
function salvarLocalStorage() {
    localStorage.setItem('registros', JSON.stringify(registros));
}

// Adicionar registro
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const funcionario = document.getElementById('funcionario').value;
    const horas = parseFloat(document.getElementById('horas').value);
    const data = document.getElementById('data').value;

    registros.push({ funcionario, horas, data });
    salvarLocalStorage();
    listarRegistros();
    form.reset();
});

// Listar registros
function listarRegistros() {
    tabela.innerHTML = '';
    registros.forEach((registro, index) => {
        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${registro.funcionario}</td>
            <td>${registro.horas}</td>
            <td>${registro.data}</td>
            <td>
                <button class="deletar" data-index="${index}">Deletar</button>
            </td>
        `;
    });

    document.querySelectorAll('.deletar').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            registros.splice(index, 1);
            salvarLocalStorage();
            listarRegistros();
        });
    });
}

// Gerar relatório
function gerarRelatorio(filtrarFuncionario = null) {
    const registrosFiltrados = filtrarFuncionario
        ? registros.filter(r => r.funcionario === filtrarFuncionario)
        : registros;

    let saldo = 0;
    let conteudo = `Relatório de Horas\n\n`;
    registrosFiltrados.forEach((registro) => {
        saldo += registro.horas;
        conteudo += `Funcionário: ${registro.funcionario}, Horas: ${registro.horas}, Data: ${registro.data}\n`;
    });
    conteudo += `\nSaldo Total: ${saldo} horas`;

    // Baixar relatório como PDF
    const blob = new Blob([conteudo], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${filtrarFuncionario || 'geral'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}

// Eventos para os botões de relatório
btnRelatorioGeral.addEventListener('click', () => gerarRelatorio());
btnRelatorioFuncionario.addEventListener('click', () => {
    const funcionario = filtroFuncionario.value.trim();
    if (funcionario) gerarRelatorio(funcionario);
});

// Inicializa a listagem
listarRegistros();
