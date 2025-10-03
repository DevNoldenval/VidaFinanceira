import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
  carregarBancos();
  carregarBandeiras();
  
  document.getElementById('form-banco').addEventListener('submit', async function(e) {
    e.preventDefault();
    await adicionarBanco();
  });
  
  document.getElementById('form-bandeira').addEventListener('submit', async function(e) {
    e.preventDefault();
    await adicionarBandeira();
  });
});

async function carregarBancos() {
  try {
    const bancosRef = collection(db, 'bancos');
    const querySnapshot = await getDocs(bancosRef);
    
    const tabela = document.getElementById('tabela-bancos');
    tabela.innerHTML = '';
    
    querySnapshot.forEach(doc => {
      const banco = doc.data();
      const row = tabela.insertRow();
      row.innerHTML = `
        <td>${banco.nome}</td>
        <td>${banco.agencia}</td>
        <td>${banco.conta}</td>
        <td>
          <button class="btn btn-warning" onclick="editarBanco('${doc.id}', '${banco.nome}', '${banco.agencia}', '${banco.conta}')">Editar</button>
          <button class="btn btn-danger" onclick="excluirBanco('${doc.id}')">Excluir</button>
        </td>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar bancos: ", error);
  }
}

async function carregarBandeiras() {
  try {
    const bandeirasRef = collection(db, 'bandeiras');
    const querySnapshot = await getDocs(bandeirasRef);
    
    const tabela = document.getElementById('tabela-bandeiras');
    tabela.innerHTML = '';
    
    querySnapshot.forEach(doc => {
      const bandeira = doc.data();
      const row = tabela.insertRow();
      row.innerHTML = `
        <td>${bandeira.nome}</td>
        <td>
          <button class="btn btn-warning" onclick="editarBandeira('${doc.id}', '${bandeira.nome}')">Editar</button>
          <button class="btn btn-danger" onclick="excluirBandeira('${doc.id}')">Excluir</button>
        </td>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar bandeiras: ", error);
  }
}

async function adicionarBanco() {
  const nome = document.getElementById('nome-banco').value.trim();
  const agencia = document.getElementById('agencia-banco').value.trim();
  const conta = document.getElementById('conta-banco').value.trim();
  
  if (!nome || !agencia || !conta) {
    alert('Por favor, preencha todos os campos!');
    return;
  }
  
  try {
    await addDoc(collection(db, 'bancos'), { 
      nome, 
      agencia, 
      conta 
    });
    document.getElementById('form-banco').reset();
    carregarBancos();
  } catch (error) {
    console.error("Erro ao adicionar banco: ", error);
    alert('Erro ao adicionar banco. Tente novamente.');
  }
}

async function adicionarBandeira() {
  const nome = document.getElementById('nome-bandeira').value.trim();
  
  if (!nome) {
    alert('Por favor, informe o nome da bandeira!');
    return;
  }
  
  try {
    await addDoc(collection(db, 'bandeiras'), { nome });
    document.getElementById('form-bandeira').reset();
    carregarBandeiras();
  } catch (error) {
    console.error("Erro ao adicionar bandeira: ", error);
    alert('Erro ao adicionar bandeira. Tente novamente.');
  }
}

async function editarBanco(id, nomeAtual, agenciaAtual, contaAtual) {
  const novoNome = prompt('Editar nome do banco:', nomeAtual);
  const novaAgencia = prompt('Editar agência:', agenciaAtual);
  const novaConta = prompt('Editar conta:', contaAtual);
  
  if (novoNome !== null && novaAgencia !== null && novaConta !== null) {
    const nomeTrim = novoNome.trim();
    const agenciaTrim = novaAgencia.trim();
    const contaTrim = novaConta.trim();
    
    if (nomeTrim === '' || agenciaTrim === '' || contaTrim === '') {
      alert('Todos os campos devem ser preenchidos!');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'bancos', id), { 
        nome: nomeTrim, 
        agencia: agenciaTrim, 
        conta: contaTrim 
      });
      carregarBancos();
    } catch (error) {
      console.error("Erro ao editar banco: ", error);
      alert('Erro ao editar banco. Tente novamente.');
    }
  }
}

async function editarBandeira(id, nomeAtual) {
  const novoNome = prompt('Editar nome da bandeira:', nomeAtual);
  
  if (novoNome && novoNome.trim() !== '') {
    try {
      await updateDoc(doc(db, 'bandeiras', id), { nome: novoNome.trim() });
      carregarBandeiras();
    } catch (error) {
      console.error("Erro ao editar bandeira: ", error);
      alert('Erro ao editar bandeira. Tente novamente.');
    }
  }
}

async function excluirBanco(id) {
  if (confirm('Tem certeza que deseja excluir este banco?')) {
    try {
      await deleteDoc(doc(db, 'bancos', id));
      carregarBancos();
    } catch (error) {
      console.error("Erro ao excluir banco: ", error);
      alert('Erro ao excluir banco. Tente novamente.');
    }
  }
}

async function excluirBandeira(id) {
  if (confirm('Tem certeza que deseja excluir esta bandeira?')) {
    try {
      await deleteDoc(doc(db, 'bandeiras', id));
      carregarBandeiras();
    } catch (error) {
      console.error("Erro ao excluir bandeira: ", error);
      alert('Erro ao excluir bandeira. Tente novamente.');
    }
  }
}

// Tornar funções globais
window.editarBanco = editarBanco;
window.editarBandeira = editarBandeira;
window.excluirBanco = excluirBanco;
window.excluirBandeira = excluirBandeira;