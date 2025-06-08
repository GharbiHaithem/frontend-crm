import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    if (typeof imageData === 'string') {
      return `data:image/jpeg;base64,${imageData}`;
    }
    if (imageData.data && Array.isArray(imageData.data)) {
      try {
        const uint8Array = new Uint8Array(imageData.data);
        const blob = new Blob([uint8Array], { type: imageData.contentType || 'image/jpeg' });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error("Erreur de conversion de l'image:", err);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center mt-10"><div className="loader" /></div>;

  if (error) return <div className="text-center mt-10 text-red-500">Erreur: {error}</div>;

  if (!article) return <div className="text-center mt-10">Article non trouvé</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/articles')}
        className="mb-4 inline-flex items-center text-blue-600 hover:underline"
      >
        ← Retour à la liste
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{article.libelle}</h1>
            <p className="text-gray-600 mb-4">Code: {article.code}</p>

            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">{article.type}</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">{article.Nature}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm text-gray-700">Famille</p>
                <p>{article.libelleFamille?.name || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700">Catégorie</p>
                <p>{article.libeleCategorie?.name || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700">Nombre d'unités</p>
                <p>{article.Nombre_unite || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700">TVA</p>
                <p>{article.tva ? `${article.tva}%` : 'Non spécifié'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Informations financières</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold">Prix brut</p>
                <p>{article.prix_brut?.toFixed(2) || '0.00'} €</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Remise</p>
                <p>{article.remise ? `${article.remise}%` : '0%'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Prix net</p>
                <p>{article.prix_net?.toFixed(2) || '0.00'} €</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Prix HT</p>
                <p>{article.prixht?.toFixed(2) || '0.00'} €</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Prix total</p>
                <p>{article.prix_totale_concré?.toFixed(2) || '0.00'} €</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Marge</p>
                <p>{article.marge || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Image de l'article</h2>
          {article.image_article ? (
            <img
              src={getImageUrl(article.image_article)}
              alt={article.libelle}
              className="max-h-52 border rounded cursor-pointer"
              onClick={() => setOpenImageDialog(true)}
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            <p className="text-gray-500">Aucune image disponible pour cet article</p>
          )}
        </div>

        {/* Dimensions */}
        {article.dimension_article && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Dimensions</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-semibold">Longueur</p>
                <p>{article.longueur} cm</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Largeur</p>
                <p>{article.largeur} cm</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Hauteur</p>
                <p>{article.hauteur} cm</p>
              </div>
            </div>
          </div>
        )}

        {/* Autres infos */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Autres informations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-semibold">Gestion configuration</p>
              <p>{article.gestion_configuration || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Configuration</p>
              <p>{article.configuration || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Série</p>
              <p>{article.serie ? 'Oui' : 'Non'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Mouvement article</p>
              <p>{article.movement_article || 'Non spécifié'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Dernière modification:</strong> {new Date(article.date_modif).toLocaleString()} par {article.user_Connectée}</p>
          <p className="mt-1"><strong>Action:</strong> {article.action_user_connecté}</p>
        </div>
      </div>

      {/* Modal d’image plein écran */}
      {openImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Image de l'article: {article.libelle}</h3>
              <button onClick={() => setOpenImageDialog(false)} className="text-red-500">✕</button>
            </div>
            <img
              src={getImageUrl(article.image_article)}
              alt={article.libelle}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetails;
