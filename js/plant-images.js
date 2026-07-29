const PLANT_IMAGES = {
  "Aloe Vera":              "https://static.vecteezy.com/system/resources/previews/055/679/637/large_2x/aloe-vera-plant-growing-in-pot-isolated-on-white-background-photo.jpg",
  "Snake Plant":            "https://img.magnific.com/premium-photo/snake-plant-pot-large-white-isolated-white-background_158502-310.jpg",
  "Echeveria Elegans":      "https://foliage-factory.com/cdn/shop/files/echeveria-elegans-03.webp?v=1776360008&width=960",
  "Jade Plant":             "https://plantsguru.com/cdn/shop/files/jade-small-plant1.jpg?v=1736766074&width=1100",
  "Monstera Deliciosa":     "https://png.pngtree.com/png-clipart/20241018/original/pngtree-monstera-tree-plant-isolated-home-garden-with-pot-png-image_16371758.png",
  "Peace Lily":             "https://static.vecteezy.com/system/resources/thumbnails/068/536/600/small_2x/peace-lily-plant-with-white-flowers-isolated-on-a-transparent-background-png.png",
  "ZZ Plant":               "https://floralacres.ca/cdn/shop/files/30839-2_720x.jpg?v=1697234822",
  "Fiddle Leaf Fig":        "https://floralacres.ca/cdn/shop/files/29692-3_720x.jpg?v=1686974812",
  "Phalaenopsis Orchid":    "https://floralacres.ca/cdn/shop/files/35698-1_720x.jpg?v=1728165551",
  "Anthurium Red":          "https://floralacres.ca/cdn/shop/files/39094-1_720x.jpg?v=1753994842",
  "Bromeliad":              "https://floralacres.ca/cdn/shop/files/11528-1_720x.jpg?v=1751320249",
  "African Violet":         "https://floralacres.ca/cdn/shop/products/4INAFRICANVIOLET-VIOLET1_720x.jpg?v=1608648248",
  "Sweet Basil":            "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQFbNOnLBfDhIE4UB7MtSNMAoOSZq00k2NDVCphQBAGspVn14sfRhXd3UoapHOGfNRXQxuOD_F153dJwf6D5x23gnhKMlpZ",
  "Peppermint":             "https://i.etsystatic.com/8031038/r/il/65b9ae/6901480622/il_1588xN.6901480622_mm50.jpg",
  "Rosemary":               "https://floralacres.ca/cdn/shop/products/15343_1024x1024@2x.jpg?v=1621806335",
  "Thai Basil":             "https://floralacres.ca/cdn/shop/products/13302_720x.jpg?v=1620520991",
  "Bougainvillea":          "https://floralacres.ca/cdn/shop/files/39022-1_720x.jpg?v=1752611274",
  "Hibiscus":               "https://floralacres.ca/cdn/shop/files/33295-1_1024x1024@2x.jpg?v=1712770548",
  "Plumeria":               "https://floralacres.ca/cdn/shop/files/33971-1_1024x1024@2x.jpg?v=1718057667",
  "Bird of Paradise":       "https://floralacres.ca/cdn/shop/products/13345-1_1024x1024@2x.jpg?v=1709219821",
  "Pothos Golden":          "https://floralacres.ca/cdn/shop/products/20203-1_720x.jpg?v=1687630539",
  "Rubber Plant":           "https://floralacres.ca/cdn/shop/products/14080_720x.jpg?v=1686974846"
};

function getPlantImage(name) {
  return PLANT_IMAGES[name] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=fillmax&w=600&q=80";
}