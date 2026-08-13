//Initialisation du panier
const panier = [];

//Récuperation des balises via leur id dans le html
const conteneur = document.querySelector("#produits");
const compteur = document.querySelector("#compteur");
const btnPanier = document.querySelector("#btn-panier");
const contenuPanier=document.querySelector("#contenu-panier");
const bntCollection=document.querySelector("#collection");
const collections=document.querySelector("#cartes-produit");
const loader = document.querySelector("#loader");
const messageErreur = document.querySelector("#erreur");

//Remonter sur la section du panier
btnPanier.addEventListener("click", () => {
    contenuPanier.scrollIntoView();
});

//Remonter sur la section des produits
bntCollection.addEventListener("click",()=>{
    collections.scrollIntoView();
})
//Affichage du panier 
function affichePanier(){
    contenuPanier.innerHTML="";
    for(let i=0;i<panier.length;i++){
        const carte = document.createElement("article");
        carte.innerHTML = `
        <img src="${panier[i].image}" alt="${panier[i].title}">
        <h3>${panier[i].title}</h3>
        <p>${panier[i].price}</p>
        <p>${panier[i].category}</p>
    `;

    contenuPanier.appendChild(carte);
    }

}

// Ajouter un produit au panier
function ajoutPanier(produit) {
    panier.push(produit);
    compteur.textContent = panier.length;
    affichePanier();
}



// Création  d'une carte produit
function creerCarte(produit) {
    const carte = document.createElement("article");

    carte.innerHTML = `
        <img src="${produit.image}" alt="${produit.title}">
        <h3>${produit.title}</h3>
        <p>${produit.price}</p>
        <p>${produit.category}</p>
        <button>Ajouter au panier</button>
    `;

    const bouton = carte.querySelector("button");

    bouton.addEventListener("click", () => {
        ajoutPanier(produit);
    });

    conteneur.appendChild(carte);
}

// Récupération des produits via l'api et manipulation des données
async function chargerProduits() {
    loader.style.display="block";
    try {
        const reponse = await fetch("https://fakestoreapi.com/products");

        if (!reponse.ok) {
            throw new Error(
                "Un problème est survenu lors de la connexion " + reponse.status
            );
        }

        const data = await reponse.json();
        

        //Récupération des produits par catégorie
        const boutons=document.querySelectorAll(".categorie");
        for(let i=0;i<boutons.length;i++){
            boutons[i].addEventListener("click",()=>{
            const categorie=boutons[i].dataset.categorie;
            if(categorie==="all"){
                conteneur.innerHTML="";
                for(let i=0;i<data.length;i++){
                    creerCarte(data[i]);
                }
            }
            else{
                const produits=data.filter((produit)=>{
                    return  produit.category===categorie;
        
                });
                    conteneur.innerHTML="";
                    for(let i=0;i<produits.length;i++){
                        creerCarte(produits[i]);
                    }
                }
              });
            }



        // Afficher tous les produits sur la page html
        for (let i = 0; i < data.length; i++) {
            creerCarte(data[i]);
        }

        // Barre de recherche d'un produit avec filtrage
        const recherche = document.querySelector("#recherche");

        recherche.addEventListener("input", () => {
            const laRecherche = recherche.value.trim();

            const produits = data.filter((produit) => {
                return produit.title.toUpperCase().includes(laRecherche.toUpperCase());
            });

            // Supprimer les anciennes cartes produit
            conteneur.innerHTML = "";

            // Afficher les résultats
            for (let i = 0; i < produits.length; i++) {
                creerCarte(produits[i]);
            }
        });

        
    } 
    catch (erreur) {
        messageErreur.textContent="Une erreur est survenue ";
    }

    finally{
        loader.style.display="none";
    }
}

chargerProduits();