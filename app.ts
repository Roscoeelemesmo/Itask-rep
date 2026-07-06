// 1. Classe que representa o Modelo e Componente da Tarefa
class Tarefa {
    public id: string;
    public titulo: string;
    public descricao: string;
    public dataCriacao: Date;
    public concluida: boolean;

    constructor(titulo: string, descricao: string) {
        this.id = Math.random().toString(36).substring(2, 9); // ID único
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataCriacao = new Date(); // Captura do timestamp
        this.concluida = false;
    }

    // Formata a data de criação
    private formatarData(): string {
        return this.dataCriacao.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Gera o elemento HTML
    public renderizar(onToggleStatus: (id: string) => void): HTMLElement {
        const card = document.createElement('div');
        card.className = `task-card ${this.concluida ? 'completed' : ''}`;
        card.id = this.id;

        card.innerHTML = `
            <div class="task-header">
                <h3>${this.titulo}</h3>
                <input type="checkbox" ${this.concluida ? 'checked' : ''} class="task-checkbox" />
            </div>
            ${this.descricao ? `<p>${this.descricao}</p>` : ''}
            <span class="task-time">Criado às: ${this.formatarData()}</span>
        `;

        const checkbox = card.querySelector('.task-checkbox') as HTMLInputElement;
        checkbox.addEventListener('change', () => {
            this.concluida = checkbox.checked;
            onToggleStatus(this.id);
        });

        return card;
    }
}

class App {
    private tarefas: Tarefa[] = [];
    private form: HTMLFormElement;
    private listContainer: HTMLDivElement;

    constructor() {
        this.form = document.getElementById('task-form') as HTMLFormElement;
        this.listContainer = document.getElementById('task-list') as HTMLDivElement;
        
        this.escutarEventos();
    }

    private escutarEventos(): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarTarefa();
        });
    }

    private adicionarTarefa(): void {
        const tituloInput = document.getElementById('task-title') as HTMLInputElement;
        const descInput = document.getElementById('task-desc') as HTMLTextAreaElement;

        if (!tituloInput.value.trim()) return;

        const novaTarefa = new Tarefa(tituloInput.value, descInput.value);
        this.tarefas.push(novaTarefa);


        this.form.reset();

        this.atualizarInterface();
    }

    private alternarStatusTarefa(id: string): void {
        const tarefa = this.tarefas.find(t => t.id === id);
        if (tarefa) {
            const elementoHtml = document.getElementById(id);
            if (elementoHtml) {
                elementoHtml.classList.toggle('completed', tarefa.concluida);
            }
        }
    }

    private atualizarInterface(): void {
        this.listContainer.innerHTML = '';
        this.tarefas.forEach(tarefa => {
            const elemento = tarefa.renderizar((id) => this.alternarStatusTarefa(id));
            this.listContainer.appendChild(elemento);
        });
    }
}

// Inicialização
new App();