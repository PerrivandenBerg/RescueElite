// Perri van den Berg (2025)

// // Global colors:
let colorData = {
    'wall': 'gray',
    'enemy': '#1E90FF',
    'enemy_angry': '#FF901E',
    'platform': 'white',
    'person': '#F5F5F5',
    'fuel_station': '#A5A5A5',
    'explosion': '#F5F5F5',
    'player': '#B8C76F',
    'bullet': '#F5F5F5',
    'bullet_enemy': '#FF5252',
    'rocket': '#FFA726',
    'break': 'gray',
    'button0': '#1E88E5',
    'button1': '#C62828',
    'button2': '#2E7D32',
    'button3': '#FBC02D',
    'background': 'black',
}



// Calculates the distance between two positions.
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
