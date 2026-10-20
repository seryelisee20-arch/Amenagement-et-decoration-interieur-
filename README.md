# ORCA Déco CI – Intégration du paiement Mobile Money

Étude et prototype d'intégration du paiement **Mobile Money** au système de gestion de **ORCA Déco CI**, une entreprise de décoration et d'aménagement intérieur.

Projet réalisé dans le cadre du module **Atelier du logiciel** (Licence 3 Génie logiciel).

- **Étudiant** : Christ (nom de famille à compléter)
- **Enseignant** : à compléter
- **Établissement et année** : à compléter
- **Entreprise étudiée** : ORCA Déco CI

## Présentation de l'entreprise

ORCA Déco CI est une entreprise spécialisée dans la décoration et l'aménagement intérieur. Elle accompagne ses clients dans le choix de produits et de solutions destinés à aménager, équiper et embellir leurs espaces de vie ou de travail. Selon les besoins, les échanges avec les clients portent sur la présentation des produits, les commandes, la facturation, la livraison et le suivi après-vente.

- **Localisation** : à confirmer
- **Responsable** : à confirmer
- **Effectif et organisation** : à confirmer
- **Logiciel de gestion actuel** : à confirmer

> **Note :** ces informations sont rédigées à partir des éléments disponibles pour le projet académique. L'historique, le statut juridique, les coordonnées, le catalogue complet et l'organisation interne restent à confirmer auprès d'ORCA Déco CI.

## Présentation du projet

### Besoin identifié

Lors de la prise de contact avec l'entreprise, une piste d'amélioration est ressortie : **l'intégration du paiement Mobile Money** au système de gestion existant, pour les achats en ligne et en magasin. L'objectif n'est pas de remplacer le système actuel sans justification, mais d'étudier la faisabilité d'une intégration qui faciliterait le règlement des achats et améliorerait le suivi des transactions.

### Solution envisagée

Une intégration du paiement Mobile Money, qui couvrirait provisoirement :

- le paiement des achats en ligne ;
- le paiement des achats en magasin ;
- le suivi du statut des transactions ;
- l'association de chaque paiement à une vente ;
- la consultation de l'historique par les personnes autorisées ;
- la gestion des paiements en attente, échoués ou annulés.

Les opérateurs envisagés sont Orange Money, MTN MoMo, Wave et Moov Money. Leur disponibilité dépendra des services réellement accessibles à l'entreprise, des conditions des opérateurs et des possibilités d'intégration avec le logiciel actuel.

Ce périmètre est une **base de travail provisoire**, à confirmer avec ORCA Déco CI avant toute conception détaillée.

### Utilisateurs

| Profil | Rôle dans la solution |
|---|---|
| Client | Règle ses achats par Mobile Money, en ligne ou en magasin |
| Vendeur | Enregistre la vente et suit le statut du paiement |
| Responsable | Consulte l'historique des transactions et gère les paiements en attente, échoués ou annulés |

### Principes à respecter

- **Fiabilité** : un paiement n'est considéré comme réussi qu'après confirmation fiable du prestataire.
- **Sécurité** : les clés d'accès techniques restent côté serveur, et le code PIN Mobile Money du client n'est jamais enregistré par l'application.
- **Confidentialité** : seules les données nécessaires au projet sont utilisées, avec l'autorisation de l'entreprise.
- **Compatibilité** : l'intégration au logiciel existant est privilégiée lorsqu'elle est techniquement possible.
- **Progressivité** : on commence par un scénario pilote et un opérateur accessible en environnement de test, avant d'envisager plusieurs intégrations.

### Technologies

| Couche | Technologie |
|---|---|
| Logiciel existant | À confirmer |
| Back-end | À définir |
| Base de données | À définir |
| Passerelle ou API de paiement | À définir (selon les accès disponibles) |

## Informations à confirmer

- le nom et les caractéristiques techniques du logiciel actuel ;
- la manière dont les paiements sont actuellement gérés ;
- les comptes marchands et les accès API disponibles ;
- le parcours souhaité pour les paiements en magasin ;
- les opérateurs prioritaires ;
- le périmètre exact du prototype et les critères de validation.

## Liens utiles

- [Cahier des charges](01_Cadrage/Cahier_des_charges_ORCA_Deco_CI.docx)

## Structure du dépôt

```
ORCA_Deco_CI/
├── README.md
├── 01_Cadrage/        # cahier des charges et documents utiles au projet
└── 02_Modelisation/   # diagrammes de cas d'utilisation, d'activité, de séquence et de classes
```

---

*Document préparé dans le cadre d'un projet académique de Licence 3 Génie logiciel. Il ne remplace pas une description institutionnelle validée par l'entreprise.*