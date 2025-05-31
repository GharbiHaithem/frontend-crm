import axios from 'axios';
import React, { useEffect, useState } from 'react'

const PopularProduct = ({isLoading,setIsLoading}) => {
       const [articles, setArticles] = useState(null);
 useEffect(() => {
  setIsLoading(true);
  axios.get('http://localhost:5000/articles/par-quantite')
    .then((result) => {
      const data = result.data;
      setArticles(data);
      // Si les articles sont vides, on laisse isLoading à true
      if (!data || data.length === 0) {
        return;
      }
      setIsLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setIsLoading(false); // important pour éviter spinner infini si erreur
    });
}, []);

      console.log(isLoading)
  return (
     <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-6">
            Popular Products
          </h3>

          <div className="space-y-4">
            {isLoading || articles?.length===0 ? (
              Array(4)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-center p-3 border border-neutral-100 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-neutral-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </div>
                ))
            ) : (
              <>
            {articles &&articles?.slice(0,4)?.map((article,i)=>(
                      <div key={article?._id} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-md flex font-bold items-center justify-center mr-3">
                     #{i+1}
                    </div>
                    <div>
                      <p className="font-medium text-xs text-neutral-800">{article?.libelle}</p>
                      <p className="text-xs text-neutral-500">{article?.libeleCategorie?.designationCategorie}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-xs text-neutral-800">{(article?.prixht).toFixed(2)} Tnd</span>
                </div>
            ))}

         

      
              </>
            )}
          </div>

          <button className="w-full mt-6 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Products
          </button>
        </div>
  )
}

export default PopularProduct