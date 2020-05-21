import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequisicaoDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequisicaoDTO): Transaction {
    // Valida se o type é permitido
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type invalid.');
    }

    // Verifica o saldo da conta
    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error("You don't have money in your balance to do this.");
    }

    // Cria o tipo de transação income/outcome
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
