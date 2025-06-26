// 
// 
import React, { useState } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);

  const API_URL = "https://np9ubpqi83.execute-api.us-east-1.amazonaws.com/samiradev";

  const fetchFiles = () => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar arquivos da API.");
        return response.json();
      })
      .then((data) => {
        setFiles(data.arquivos || []);
        setLoading(false);
        setShowList(true);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setShowList(false);
      });
  };

  const handleCreate = () => {
    setError(null);
    if (!filename || !content) {
      alert("Por favor, preencha nome e conteúdo do arquivo.");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao criar arquivo");
        return res.json();
      })
      .then(() => {
        alert("Arquivo criado com sucesso!");
        setFilename("");
        setContent("");
        if (showList) fetchFiles();
      })
      .catch((err) => {
        alert("Erro ao criar arquivo: " + err.message);
        setError(err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 text-white p-6 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-extrabold mb-6 tracking-wide text-pink-400 drop-shadow-md">
        Upload de Arquivos S3
      </h1>

      <div className="w-full max-w-md bg-pink-900 rounded-xl shadow-lg p-4 mb-6">
        <label className="block mb-1 font-semibold text-pink-300" htmlFor="filename">
          Nome do arquivo

        </label>
        <input
          id="filename"
          type="text"
          placeholder="ex: doc.txt"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full p-2 rounded-md bg-pink-800 border border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-3 text-white placeholder-pink-300 text-sm"
        />

        <label className="block mb-1 font-semibold text-pink-300" htmlFor="content">
          Conteúdo do arquivo

        </label>
        <textarea
          id="content"
          rows={3}
          placeholder="Digite o conteúdo aqui..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 rounded-md bg-pink-800 border border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4 text-white placeholder-pink-300 text-sm resize-y"
        />

        <button
          onClick={handleCreate}
          className="w-full bg-pink-600 hover:bg-pink-700 transition-colors py-2 rounded-md font-semibold shadow-md focus:ring-4 focus:ring-pink-400 active:scale-95 text-sm"
        >
          Criar Arquivo

        </button>
      </div>

      <button
        onClick={fetchFiles}
        className="mb-5 bg-purple-600 hover:bg-purple-700 transition-colors py-2 px-6 rounded-md font-semibold shadow-md focus:ring-4 focus:ring-purple-400 active:scale-95 text-sm"
      >
        Listar todos os arquivos

      </button>

      {loading && <p className="text-pink-300 mb-4 animate-pulse text-sm">Carregando arquivos...</p>}

      {error && (
        <p className="text-red-400 font-semibold mb-4 bg-red-900 bg-opacity-40 px-3 py-1 rounded-md shadow-inner text-sm">
          Erro: {error}
        </p>
      )}

      {showList && !loading && !error && (
        <section className="w-full max-w-md bg-pink-900 rounded-xl shadow-lg p-4">
          <h2 className="text-xl font-bold mb-3 text-pink-400">Lista de Arquivos</h2>

          {files.length === 0 ? (
            <p className="text-pink-300 text-sm">Nenhum arquivo encontrado.</p>
          ) : (
            <ul className="divide-y divide-pink-700 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-900 text-sm">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="py-1 px-3 hover:bg-pink-700 rounded cursor-pointer select-none truncate"
                  title={file}
                >
                  {file}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
