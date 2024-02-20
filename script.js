// Dimensions for the SVG container
const width = 1377;
const height = 777;

// Append SVG to the container div
const svg = d3.select('#word-cloud')
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', `translate(${width / 2}, ${height / 2})`);


const languages = [
    { name: 'Chinese', size: 188 },
    { name: 'English', size: 188 },
    { name: 'French', size: 158 },
    { name: 'Italian', size: 158 },
    { name: 'Japanese', size: 188 },
    { name: 'Russian', size: 88 },
    { name: 'Norwegian', size: 88 }
];

// Example color scales (you can add more or choose different ones)
const colorScales = [d3.interpolateRdPu, d3.interpolatePuRd,d3.interpolateYlOrRd,
                     d3.interpolateBuGn, d3.interpolateBuPu,d3.interpolateOrRd, 
                     d3.interpolatePuBu,d3.interpolateYlGn, d3.interpolateYlOrBr];


// Function to show flags
function showFlags() {
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => flag.classList.remove('hidden'));
}

// Function to hide flags
function hideFlags() {
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => flag.classList.add('hidden'));
}

// Function to create and start the initial word cloud layout
function createInitialLayout() {
    console.log("Creating initial layout...");

    // Show flags when going back to the initial layout
    showFlags();
    
    // Set the title and "Go Back" button visibility
    document.getElementById('page-title').style.display = 'block';
    document.getElementById('go-back').style.display = 'none';

    // Clear any existing SVG elements
    svg.selectAll("*").remove();

    // Define the layout for the initial word cloud
    const initialLayout = d3.layout.cloud()
        .size([width, height])
        .words(languages.map(d => ({ text: d.name, size: d.size })))
        .padding(5)
        .rotate(() => 0)
        .fontSize(d => d.size)
        .on('end', drawInitial);

    // Start the word cloud layout
    initialLayout.start();
}



// Function to render the initial word cloud
function drawInitial(words) {
    console.log("Drawing initial words", words);

    const wordEnter = svg.selectAll('text')
                    .data(words)
                    .enter().append('text');

    wordEnter.style('font-size', d => `${d.size}px`)
             .style('fill', 'lightgrey')
             .attr('text-anchor', 'middle')
             .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
             .text(d => d.text)
             .on('mouseover', function (d) {
                 d3.select(this).style('fill', 'black');
             })
             .on('mouseout', function (d) {
                 d3.select(this).style('fill', 'lightgrey');
             })
             .on('click', function (event, d) {
                 console.log("Language clicked", d);
                 createWordCloud(d.text);
             });
}

// Function to render the language-specific word cloud
function drawLanguageSpecific(words) {
    document.getElementById('page-title').style.display = 'none'; // Hide the title
    document.getElementById('go-back').style.display = 'block'; // Show the go-back button

    // Randomly choose a color scale
    const colorScale = d3.scaleSequential(colorScales[Math.floor(Math.random() * colorScales.length)])
                        .domain([0, Math.max(...words.map(d => d.size))]);


    svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('fill', d => colorScale(d.size)) // Apply color based on size
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
}


// Function to load a text file and create a word cloud
function createWordCloud(language) {
    let filename = '';
    if (language === 'Chinese' || language === 'Japanese') {
        filename = `most-common-words-by-language-master/src/resources/cleaned_${language.toLowerCase()}.txt`;
    } else {
        filename = `most-common-words-by-language-master/src/resources/${language.toLowerCase()}.txt`;
    }

    fetch(filename)
        .then(response => response.text())
        .then(data => {
            svg.selectAll("*").remove();

            // Calculate the word sizes based on rank with explicit size tiers
            let words = data.split("\n");
            let sizeScale = i => {
                if (i < 3) return 180; // Top 10 words
                if (i < 5) return 150; // Top 10 words
                if (i < 10) return 120; // Top 10 words
                if (i < 20) return 100; // Top 10 words
                if (i < 50) return 80; // Next 10 words
                if (i < 80) return 50;
                return 20;  // All other words
            };            
            words = words.map((d, i) => ({ text: d, size: sizeScale(i) }));


            d3.layout.cloud()
                .size([width, height])
                .words(words)
                .padding(5)
                .rotate(() => 0)
                .fontSize(d => d.size)
                .on('end', drawLanguageSpecific)
                .start();
        });

    // Hide flags when a language is selected
    hideFlags();
}

// Initialize the initial word cloud layout
createInitialLayout();