
function placeholderCarousel() {
    const artistArray = ['ABBA', 'Taylor Swift', 'In flames', 'Megan Thee Stallion', 'Solange', 
                        'Kendrick Lamar','Sabaton', 'Crystal Castles', 'Rammstein', 'Robin Sparkles', 'Robyn']
    
    let highlight = artistArray[Math.random() * artistArray.length]
    console.log(highlight)
    return highlight
}

export default placeholderCarousel;