import { h, patch, createElm } from '../src/framework/dom.js';
import { createStore } from '../src/framework/state.js';
import { EventManager } from '../src/framework/event.js';
import AppRouter from '../src/framework/router.js';

const events = new EventManager(document.getElementById('root'));
events.init(['click', 'input', 'change', 'submit', 'dblclick', 'keydown', 'blur']);

const state = createStore({
    todos: JSON.parse(localStorage.getItem('todos-js') || '[]'),
    draft: '',
    editingId: null,
    route: window.location.hash || '#/'
}, () => {
    render();
    localStorage.setItem('todos-js', JSON.stringify(state.todos));
});

const actions = {
    addTodo: () => {
        if (state.draft.trim().length < 2) return;
        state.todos = [...state.todos, { id: Date.now(), title: state.draft.trim(), completed: false }];
        state.draft = '';
    },
    toggleTodo: (id) => {
        state.todos = state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    },
    removeTodo: (id) => {
        state.todos = state.todos.filter(t => t.id !== id);
    },
    clearCompleted: () => {
        state.todos = state.todos.filter(t => !t.completed);
    },
    toggleAll: (val) => {
        state.todos = state.todos.map(t => ({ ...t, completed: val }));
    },
    saveEdit: (id, title) => {
        if (title.trim()) {
            state.todos = state.todos.map(t => t.id === id ? { ...t, title: title.trim() } : t);
        } else {
            actions.removeTodo(id);
        }
        state.editingId = null;
    },
ondblclick: () => {
    state.editingId = todo.id;
    setTimeout(() => {
        const input = document.querySelector('.edit');
        if (input) {
            input.focus();
            const val = input.value;
            input.value = '';
            input.value = val;
        }
    }, 0);
}
};

new AppRouter({
    routes: {
        '#/': () => state.route = '#/',
        '#/active': () => state.route = '#/active',
        '#/completed': () => state.route = '#/completed'
    }
});

const TodoItem = (todo) => {
    const isEditing = state.editingId === todo.id;
    return h('li', { class: `${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}` }, [
        h('div', { class: 'view' }, [
            h('input', { class: 'toggle', type: 'checkbox', checked: todo.completed, onchange: () => actions.toggleTodo(todo.id) }),
            h('label', { ondblclick: () => state.editingId = todo.id }, todo.title),
            h('button', { class: 'destroy', onclick: () => actions.removeTodo(todo.id) })
        ]),
        isEditing ? h('input', { 
            class: 'edit', 
            value: todo.title, 
            onkeydown: (e) => {
                if (e.key === 'Enter') actions.saveEdit(todo.id, e.target.value);
                if (e.key === 'Escape') state.editingId = null;
            },
            onblur: (e) => actions.saveEdit(todo.id, e.target.value)
        }) : null
    ]);
    
};

const App = () => {
    const filtered = state.todos.filter(t => 
        state.route === '#/active' ? !t.completed : 
        state.route === '#/completed' ? t.completed : true
    );
    const activeCount = state.todos.filter(t => !t.completed).length;

    return h('div', { class: 'todoapp' }, [
        h('header', { class: 'header' }, [
            h('h1', {}, 'todos'),
            h('input', { 
                class: 'new-todo', 
                placeholder: 'What needs to be done?', 
                value: state.draft,
                oninput: (e) => state.draft = e.target.value,
                onkeydown: (e) => e.key === 'Enter' && actions.addTodo()
            })
        ]),
        state.todos.length ? h('section', { class: 'main' }, [
            h('input', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox', onchange: (e) => actions.toggleAll(e.target.checked) }),
            h('label', { for: 'toggle-all' }, 'Mark all as complete'),
            h('ul', { class: 'todo-list' }, filtered.map(TodoItem))
        ]) : null,
        state.todos.length ? h('footer', { class: 'footer' }, [
            h('span', { class: 'todo-count' }, [h('strong', {}, activeCount), ' items left']),
            h('ul', { class: 'filters' }, [
                h('li', {}, h('a', { href: '#/', class: state.route === '#/' ? 'selected' : '' }, 'All')),
                h('li', {}, h('a', { href: '#/active', class: state.route === '#/active' ? 'selected' : '' }, 'Active')),
                h('li', {}, h('a', { href: '#/completed', class: state.route === '#/completed' ? 'selected' : '' }, 'Completed'))
            ]),
            state.todos.some(t => t.completed) ? h('button', { class: 'clear-completed', onclick: actions.clearCompleted }, 'Clear completed') : null
        ]) : null
    ]);
};

let oldV = null;
const root = document.getElementById('root');
function render() {
    const newV = App();
    if (!oldV) {
        root.innerHTML = '';
        root.appendChild(createElm(newV));
    } else {
        patch(root, newV, oldV);
    }
    oldV = newV;
}
render();