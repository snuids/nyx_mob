# Features to implement

## First week

- [x] status se met en fonction de ce qui est dans le store
- [x] trier selon les locs et mettre le loc à 100 s'il n'en a pas
- [x] ajouter les boutons de tri frais et sec sur show order
- [x] ajouter un petit tag frais et sec (badge quasar)
- [x] mettre un petit historique sur chaque line item
  - [x] ça sera un objet avec status, date, et user
- [x] ajouter un loader sur les commandes



## Second week

- [x] use loc on item
- [x] loc and fresh
- [ ] bug sur les line items au niveau des classes (??)
- [x] ajout de status frais et sec (qui détermine le genre de lock qu'on met)
  - [x] ajout de lock type sur du dry et du fresh (lock_type = dry or fresh)
  - [x] peut dire qu'il est en cours de prépa frais ou sec ou juste en cours de prépa
- [x] changer le comportement de frais et sec (je veux voir toutes les commandes qui contiennent du sec mm si il y a du frais à l'intérieur)
- [x] ajout de liste missing frais et missing sec
- [x] status_fresh: waiting_for_prep / in_progress / finished
- [x] status_dry  : waiting_for_prep / in_progress / finished
- [x] Missing_fresh: [123, 875657, 0809]
- [x] Missing_dry: [123, 875657, 0809]
- [x] refund_fresh: [123, 875657, 0809]
- [x] refund_dry: [123, 875657, 0809]
- [x] Lock_dry. : t/f
- [x] lock_fresh: t/f
- [x] added circular progress on frais et sec
- [x] delete prepared items from the store


- [x] afficher la liste des produits qui ont été mis à ok
- [ ] put item to display in the store
- [x] put filter in the store also
- [ ] put itemsToDisplay in the store

- [x] stop two users to click same order at the same time
- [ ] quand tu cliques sur manq et que après tu cliques sur success ça comptabilise cela
- [ ] add items that are already prepared to the bottom
- [ ] items are displayed from non prepared to prepared
- [ ] added items at the end of show order
- [ ] when filter are there items disappear after first success
- [ ] no going down when filter is applied
- [ ] garde pas le statut quand on met le filtre
- [ ] bouger la partie qui gère currentOrder après le click dans showOrder
- [ ] changer les locks dry et fresh sur les items
- [ ] prendre une order, la changer et le remettre en base de données
- [ ] click the item for ok
- [ ] make two buttons for remb and manq
- [ ] put the flèche on left of vélo

- [ ] vu qu'avant on allait le chercher dans une liste et change cette liste il faut faire quelque chose
quand on ne va plus dans cette liste mais matché en quelque sorte l'individu dans la liste afin que le status soit
  mis corrrectement
  - [ ] vérifier si le clickable est mis à false quand on clique sur une commande


# Ajout du poids sur le producteur
- [ ] ajouter le poids des produits à aller chercher avec leur poids

## Bugs
- [ ] la quantité de frais et secs n'est connue que lorsque la card est cliquée
- [ ] updateOrder when preparedProducts exist you just push them inside at each sendUnlockOrder
  - var merged = [...initialData, ...newData.filter(d => !ids.has(d.ID))];
- [ ] commandes se remettent à jour automatiquement
- [ ] erreur lors sur getOrders dans le store

- [ ] quand je prépare une commande et qu'elle se termine je me retrouve bien dans ordersList mais quand je clique sur
une autre commande je vois un message de notification et la commande précedente est mise à started
  - [ ] quand je clique sur une autre commande l'url est vite fait d'être remplacé par l'url général

- [ ] les line items ne gardent pas leur status une fois qu'on a modifié un truc sur eux
- [ ] what to do when tags for hour of pickup not defined






## Features à ajouter

- [ ] filtrer les commandes au bureau, resto, mvp normal
- [ ] produits à rembourser envoi de message sur le slack pour demander si on veut remplacer le produit ou pas
- [ ] glisser la commande au lendemain
- [x] pull to refresh
- [x] tri par lock et par nom
- [x] quand on touche une commande mais qu'on ne clique sur rien, il faut qu'il se retrouve dans le statut non préparé
- [x] fini frais finie sec
- [x] bug lorsque les items sont mis mais en remb on arrive pas à commande finie avec remboursement
- [ ] préparation frais terminée alors qu'il y a des xts manquants
