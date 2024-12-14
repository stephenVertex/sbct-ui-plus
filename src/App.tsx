import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoContent, setNewTodoContent] = useState("");

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  async function createTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    
    try {
      await client.models.Todo.create({ content: newTodoContent });
      setNewTodoContent(""); // Clear the input after creating
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      await client.models.Todo.delete({ id });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  return (
    <main style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: 0
        }}>My todos</h1>
        
        <button
          onClick={signOut}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
        >
          Sign Out
        </button>
      </div>
      
      <form onSubmit={createTodo} style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '8px',
        flexDirection: 'column'
      }}>
        <textarea
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="Enter your todo..."
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            minHeight: '80px',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
        <button 
          type="submit"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Add Todo
        </button>
      </form>

      <ul style={{ 
        listStyle: 'none', 
        padding: '16px',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
            borderRadius: '8px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: 'none',
            outline: 'none'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgb(0 0 0 / 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ color: '#334155', fontSize: '1rem' }}>
              {todo.content}
            </span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{ 
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#94a3b8',
                padding: '4px 8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
              }}
              title="Delete todo"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#0369a1'
      }}>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a 
          href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates"
          style={{
            color: '#0284c7',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
