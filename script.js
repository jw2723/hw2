// common words word clouds

// SVG container dimensions
const width = 1477;
const height = 777;

// append svg to word-cloud div
const svg = d3.select('#word-cloud')
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', `translate(${width / 2}, ${height / 2})`);

// languages used
const languages = [
    { name: 'Chinese', size: 188 }, // size for initial page
    { name: 'English', size: 188 },
    { name: 'French', size: 158 },
    { name: 'Italian', size: 158 },
    { name: 'Japanese', size: 188 },
    { name: 'Russian', size: 88 },
    { name: 'Norwegian', size: 88 }
];

// color scales for word clouds
const colorScales = [d3.interpolateRdPu, d3.interpolatePuRd,d3.interpolateYlOrRd,
                     d3.interpolateBuGn, d3.interpolateBuPu,d3.interpolateOrRd, 
                     d3.interpolatePuBu,d3.interpolateYlGn, d3.interpolateYlOrBr];



// fcns to show & hide floating flags
function showFlags() {
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => flag.classList.remove('hidden'));
}
function hideFlags() {
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => flag.classList.add('hidden'));
}


// create and display the initial word cloud layout
function createInitialLayout() {
    console.log("Creating initial layout...");
    document.getElementById('page-title').style.display = 'block';
    document.getElementById('go-back').style.display = 'none';
    showFlags(); // show flags after going back to initial layout

    svg.selectAll("*").remove(); // clear any existing SVG elements

    // define layout for initial word cloud
    const initialLayout = d3.layout.cloud()
        .size([width, height])
        .words(languages.map(d => ({ text: d.name, size: d.size })))
        .padding(5)
        .rotate(() => 0)
        .fontSize(d => d.size)
        .on('end', drawInitial); // call once layout computed

    initialLayout.start(); // start word cloud layout
}


// fcn to render initial word cloud
function drawInitial(words) {
    console.log("Drawing initial words", words);

    const wordEnter = svg.selectAll('text')
                    .data(words)
                    .enter().append('text');

    wordEnter.style('font-size', d => `${d.size}px`)
             .style('fill', 'lightgrey') // when unhighlighted
             .attr('text-anchor', 'middle')
             .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
             .text(d => d.text)

             // events
             .on('mouseover', function (d) { // highlight in blc when mouse hover
                 d3.select(this).style('fill', 'black');
             })
             .on('mouseout', function (d) {
                 d3.select(this).style('fill', 'lightgrey');
             })
             .on('click', function (event, d) {
                 console.log("Language clicked", d);
                 createWordCloud(d.text); // createWordCloud when lang clicked
             });
}


// fcn to render language-specific word cloud
function drawLanguageSpecific(words) {
    document.getElementById('page-title').style.display = 'none'; // hide title
    document.getElementById('go-back').style.display = 'block'; // go back button

    const colorScale = d3.scaleSequential(colorScales[Math.floor(Math.random() * colorScales.length)])
                        .domain([0, Math.max(...words.map(d => d.size))]); // randomly choose a color scale for wordclouds

    svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('fill', d => colorScale(d.size)) // apply color based on size
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
}


// fcn to load txt files and create a word cloud
function createWordCloud(language) {
    let filename = '';
    if (language === 'Chinese' || language === 'Japanese') { // b/c chn and jap txt are cleaned
        filename = `most-common-words-by-language-master/src/resources/cleaned_${language.toLowerCase()}.txt`;
    } else {
        filename = `most-common-words-by-language-master/src/resources/${language.toLowerCase()}.txt`;
    }

    fetch(filename) // fetch
        .then(response => response.text())
        .then(data => {
            svg.selectAll("*").remove(); // clear existing SVG elements

            // determine word sizes based on rank in txt
            let words = data.split("\n");
            let sizeScale = i => {
                if (i < 3) return 180; // top in txt == most common
                if (i < 5) return 150;
                if (i < 10) return 120;
                if (i < 20) return 100;
                if (i < 50) return 80;
                if (i < 80) return 50;
                return 20;  // all other words
            };            
            words = words.map((d, i) => ({ text: d, size: sizeScale(i) }));


            d3.layout.cloud()
                .size([width, height])
                .words(words)
                .padding(5) // btn words
                .rotate(() => 0)
                .fontSize(d => d.size) // font size each word
                .on('end', drawLanguageSpecific) // once layout computed
                .start(); // start layout computation
        });

    hideFlags(); // hide flags when lang selected(wordcloud creation)
}

// initialize initial word cloud
createInitialLayout();