//Initialisation du panier et sauvagarde local
const panier = JSON.parse(localStorage.getItem("panier")) || [];

//Récuperation des balises via leur id dans le html
const conteneur = document.querySelector("#produits");
const compteur = document.querySelector("#compteur");
const btnPanier = document.querySelector("#btn-panier");
const contenuPanier=document.querySelector("#contenu-panier");
const bntCollection=document.querySelector("#collection");
const fermerPanier = document.querySelector("#fermer-panier");
const panierSection = document.querySelector("#panier");
const collections=document.querySelector("#cartes-produit");
const loader = document.querySelector("#loader");
const messageErreur = document.querySelector("#erreur");

affichePanier();

//Sauvegarde local
function sauvegarderPanier() {
    localStorage.setItem("panier", JSON.stringify(panier));
}

//Remonter sur la section des produits
bntCollection.addEventListener("click",()=>{
    collections.scrollIntoView();
})
//Ouvertur et fermeture de la barre lateral
btnPanier.addEventListener("click", () => {
    panierSection.classList.add("ouvert");
});

fermerPanier.addEventListener("click", () => {
    panierSection.classList.remove("ouvert");
});
//Affichage du panier 
function affichePanier() {
    contenuPanier.innerHTML = "";

    for (let i = 0; i < panier.length; i++) {
        const article = panier[i];
        const carte = document.createElement("article");

        carte.innerHTML = `
            <img src="${article.produit.image}" alt="${article.produit.title}">
            <h3>${article.produit.title}</h3>
            <p>${article.produit.price} $</p>

            <div class="quantite">
                <button class="moins">
                    <img src="images/signe-moins-dune-ligne-en-position-horizontale.png" alt="icon-moins">
                </button>
                <span>${article.quantite}</span>
                <button class="plus">
                    <img src="images/plus-symbole-noir.png" alt="icon-plus">
                </button>
            </div>

            <button class="supprimer">Supprimer</button>
        `;

        const moins = carte.querySelector(".moins");
        const plus = carte.querySelector(".plus");
        const supprimer = carte.querySelector(".supprimer");

        moins.addEventListener("click", () => {
            if (article.quantite > 1) {
                article.quantite--;
            } else {
                panier.splice(i, 1);
            }
            sauvegarderPanier();
            affichePanier();
        });

        plus.addEventListener("click", () => {
            article.quantite++;
            sauvegarderPanier();
            affichePanier();
        });

        supprimer.addEventListener("click", () => {
            panier.splice(i, 1);
            affichePanier();
        });

        contenuPanier.appendChild(carte);
    }
    sauvegarderPanier();
    compteur.textContent = panier.reduce(
        (total, article) => total + article.quantite,
        0
    );
}
// Ajouter un produit au panier
function ajoutPanier(produit) {
    const produitExistant = panier.find(article => article.produit.id === produit.id);

    if (produitExistant) {
        produitExistant.quantite++;
    } else {
        panier.push({
            produit: produit,
            quantite: 1
        });
    }

    compteur.textContent = panier.reduce(
        (total, article) => total + article.quantite,
        0
    );

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