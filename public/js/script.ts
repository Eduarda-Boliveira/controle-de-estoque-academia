// Sistema de Controle de Estoque - Academia Personnalité Move

interface PrecosProdutos {
  [key: string]: number;
}

interface Produto {
  nome: string;
  valor: string;
  pagamento: string;
  data: string;
}

interface ProdutoAPI {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/products';

document.addEventListener('DOMContentLoaded', (): void => {
  // Elementos do formulário
  const selectProduto: HTMLSelectElement | null = document.getElementById('produto') as HTMLSelectElement;
  const inputValor: HTMLInputElement | null = document.getElementById('valor') as HTMLInputElement;
  const selectFormaPgto: HTMLSelectElement | null = document.getElementById('formaPgto') as HTMLSelectElement;
  const formProduto: HTMLFormElement | null = document.getElementById('form-produto') as HTMLFormElement;
  const tabelaCorpo: HTMLTableSectionElement | null = document.querySelector('#tabela-despesas tbody');
  
  // Dados dos produtos (carregados da API)
  let produtosAPI: ProdutoAPI[] = [];
  
  // Preços dos produtos (atualizados dinamicamente)
  const precosProdutos: PrecosProdutos = {};

  // Nomes dos produtos para exibição (atualizados dinamicamente)
  const nomesProdutos: { [key: string]: string } = {};

  // Array para armazenar produtos vendidos
  let produtosVendidos: Produto[] = [];

  // Funções da API
  const buscarProdutos = async (): Promise<ProdutoAPI[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  };

  const criarProduto = async (produto: Omit<ProdutoAPI, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProdutoAPI | null> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
      });
      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return null;
    }
  };

  const atualizarProduto = async (id: number, produto: Partial<ProdutoAPI>): Promise<ProdutoAPI | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
  };

  const deletarProduto = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }
  };

  // Função para popular select com produtos da API
  const popularSelectProdutos = (): void => {
    if (!selectProduto) return;

    // Limpar opções existentes (manter apenas a primeira)
    while (selectProduto.children.length > 1) {
      selectProduto.removeChild(selectProduto.lastChild!);
    }

    // Adicionar produtos da API
    produtosAPI.filter(produto => produto.isActive && produto.stock > 0).forEach(produto => {
      const option = document.createElement('option');
      option.value = produto.id.toString();
      option.textContent = produto.name;
      selectProduto.appendChild(option);

      // Armazenar nos objetos de mapeamento
      nomesProdutos[produto.id.toString()] = produto.name;
      precosProdutos[produto.id.toString()] = produto.price;
    });
  };

  // Função para inicializar dados da API
  const inicializarAPI = async (): Promise<void> => {
    console.log('🔄 Carregando produtos da API...');
    
    try {
      produtosAPI = await buscarProdutos();
      console.log('✅ Produtos carregados da API:', produtosAPI.length);
      popularSelectProdutos();
      console.log('✅ Sistema inicializado!');
    } catch (error) {
      console.error('❌ Erro ao carregar produtos da API:', error);
      alert('Erro ao conectar com a API. Verifique se o servidor está rodando na porta 3000.');
    }
  };

  // Função para formatar valor em reais
  const formatarReais = (valor: number): string => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  // Função para obter data atual formatada
  const obterDataAtual = (): string => {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
  };

  // Função para adicionar produto na tabela
  const adicionarProdutoNaTabela = (produto: Produto): void => {
    if (!tabelaCorpo) return;

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.valor}</td>
      <td>${produto.pagamento}</td>
      <td>${produto.data}</td>
      <td>
        <button class="botao-excluir" onclick="removerProduto(this)">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

    tabelaCorpo.appendChild(linha);
  };

  // Função para limpar formulário
  const limparFormulario = (): void => {
    if (selectProduto) selectProduto.value = '';
    if (inputValor) inputValor.value = 'R$ 0,00';
    if (selectFormaPgto) selectFormaPgto.value = '';
  };

  // Função para remover produto (global para o onclick)
  (window as any).removerProduto = (botao: HTMLButtonElement): void => {
    const linha = botao.closest('tr');
    if (linha) {
      linha.remove();
      atualizarPainelRecebimento();
    }
  };

  // Função para converter valor string em number
  const valorParaNumero = (valorStr: string): number => {
    return parseFloat(valorStr.replace('R$ ', '').replace(',', '.'));
  };

  // Função para atualizar painel de recebimento
  const atualizarPainelRecebimento = (): void => {
    const totais = {
      geral: 0,
      dinheiro: 0,
      debito: 0,
      credito: 0,
      pix: 0
    };

    // Calcular totais percorrendo a tabela
    const linhasTabela = document.querySelectorAll('#tabela-despesas tbody tr');
    linhasTabela.forEach((linha: Element) => {
      const colunas = linha.querySelectorAll('td');
      if (colunas.length >= 3) {
        const valor = valorParaNumero(colunas[1].textContent || '0');
        const pagamento = colunas[2].textContent?.toLowerCase() || '';
        
        totais.geral += valor;
        
        switch (pagamento) {
          case 'dinheiro':
            totais.dinheiro += valor;
            break;
          case 'débito':
            totais.debito += valor;
            break;
          case 'crédito':
            totais.credito += valor;
            break;
          case 'pix':
            totais.pix += valor;
            break;
        }
      }
    });

    // Atualizar elementos do DOM
    const totalGeralEl = document.getElementById('total-geral');
    const totalDinheiroEl = document.getElementById('total-dinheiro');
    const totalDebitoEl = document.getElementById('total-debito');
    const totalCreditoEl = document.getElementById('total-credito');
    const totalPixEl = document.getElementById('total-pix');

    if (totalGeralEl) totalGeralEl.textContent = formatarReais(totais.geral);
    if (totalDinheiroEl) totalDinheiroEl.textContent = formatarReais(totais.dinheiro);
    if (totalDebitoEl) totalDebitoEl.textContent = formatarReais(totais.debito);
    if (totalCreditoEl) totalCreditoEl.textContent = formatarReais(totais.credito);
    if (totalPixEl) totalPixEl.textContent = formatarReais(totais.pix);
  };

  // Event listener para mudança no select de produto
  if (selectProduto && inputValor) {
    selectProduto.addEventListener('change', function(this: HTMLSelectElement): void {
      const produtoSelecionado: string = this.value;
      
      if (produtoSelecionado && precosProdutos[produtoSelecionado]) {
        const preco: number = precosProdutos[produtoSelecionado];
        inputValor.value = formatarReais(preco);
      } else {
        inputValor.value = 'R$ 0,00';
      }
    });

    // Limpar valor quando nenhum produto estiver selecionado
    selectProduto.addEventListener('focus', function(this: HTMLSelectElement): void {
      if (!this.value) {
        inputValor.value = 'R$ 0,00';
      }
    });
  }

  // Event listener para submissão do formulário
  if (formProduto && selectProduto && inputValor && selectFormaPgto) {
    formProduto.addEventListener('submit', async (e: Event): Promise<void> => {
      e.preventDefault();

      // Validar se todos os campos estão preenchidos
      if (!selectProduto.value || !selectFormaPgto.value || inputValor.value === 'R$ 0,00') {
        alert('Por favor, preencha todos os campos!');
        return;
      }

      // Criar objeto produto
      const novoProduto: Produto = {
        nome: nomesProdutos[selectProduto.value] || selectProduto.value,
        valor: inputValor.value,
        pagamento: selectFormaPgto.options[selectFormaPgto.selectedIndex].text,
        data: obterDataAtual()
      };

      // Atualizar estoque via API
      const produtoId = parseInt(selectProduto.value);
      const produtoAPI = produtosAPI.find(p => p.id === produtoId);
      
      if (produtoAPI && produtoAPI.stock > 0) {
        // Reduzir estoque via API
        try {
          const estoque = await atualizarProduto(produtoId, { stock: produtoAPI.stock - 1 });
          if (estoque) {
            produtoAPI.stock = estoque.stock;
            console.log(`📦 Estoque atualizado via API: ${produtoAPI.name} - Restam ${produtoAPI.stock} unidades`);
            
            // Se estoque baixo, alertar
            if (produtoAPI.stock <= 5 && produtoAPI.stock > 0) {
              console.warn(`⚠️ Estoque baixo: ${produtoAPI.name} (${produtoAPI.stock} unidades)`);
            }
            
            // Se zerou, recarregar produtos
            if (produtoAPI.stock === 0) {
              popularSelectProdutos();
              console.warn(`🚫 Produto esgotado: ${produtoAPI.name}`);
              alert(`Produto ${produtoAPI.name} esgotado!`);
            }
          }
        } catch (error) {
          console.error('Erro ao atualizar estoque:', error);
          alert('Erro ao atualizar estoque. Venda registrada localmente.');
        }
      }

      // Adicionar ao array e na tabela
      produtosVendidos.push(novoProduto);
      adicionarProdutoNaTabela(novoProduto);

      // Limpar formulário
      limparFormulario();

      // Atualizar painel de recebimento
      atualizarPainelRecebimento();

      console.log('Produto adicionado:', novoProduto);
    });
  }

  // Inicializar API
  inicializarAPI();

  // Funções utilitárias disponíveis no console para testes
  (window as any).reporEstoque = async (produtoId: number, quantidade: number): Promise<void> => {
    const produto = produtosAPI.find(p => p.id === produtoId);
    if (produto) {
      try {
        const novoEstoque = produto.stock + quantidade;
        const produtoAtualizado = await atualizarProduto(produtoId, { stock: novoEstoque });
        
        if (produtoAtualizado) {
          produto.stock = produtoAtualizado.stock;
          if (!produto.isActive && produto.stock > 0) {
            produto.isActive = true;
            popularSelectProdutos();
          }
          console.log(`✅ Estoque reposto via API: ${produto.name} - Total: ${produto.stock} unidades`);
        }
      } catch (error) {
        console.error('Erro ao repor estoque:', error);
      }
    }
  };

  (window as any).verEstoque = (): void => {
    console.table(produtosAPI.map(p => ({
      ID: p.id,
      Nome: p.name,
      Preço: `R$ ${p.price.toFixed(2)}`,
      Estoque: p.stock,
      Status: p.isActive ? '✅ Ativo' : '❌ Inativo'
    })));
  };

  (window as any).verVendas = (): void => {
    const totais = {
      vendas: produtosVendidos.length,
      faturamento: produtosVendidos.reduce((total, venda) => {
        return total + valorParaNumero(venda.valor);
      }, 0)
    };
    
    console.log('📊 Resumo de Vendas:');
    console.log(`🛒 Total de vendas: ${totais.vendas}`);
    console.log(`💰 Faturamento: R$ ${totais.faturamento.toFixed(2)}`);
    console.table(produtosVendidos);
  };

  console.log(`
🏋️‍♀️ Sistema de Controle de Estoque - Academia Personnalité Move
📚 Funções disponíveis no console:
  • reporEstoque(produtoId, quantidade) - Repor estoque de um produto
  • verEstoque() - Ver situação do estoque
  • verVendas() - Ver resumo de vendas
  `);
});