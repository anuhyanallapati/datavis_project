
var w = 2000;
var h = 600;
var proj = d3.geo.mercator();
var path = d3.geo.path().projection(proj);
var t = proj.translate(); // the projection's default translation
var s = proj.scale() // the projection's default scale

proj.scale(6700);
proj.translate([-1240, 750]);

function randomColorGenerator() {
    return ("#" + Math.floor(Math.random()*16777215).toString(16))
}

let malesColor = d3.scaleSequential().domain([0,1])
    .interpolator(d3.interpolatePuBu)

let femalesColor = d3.scaleSequential().domain([0,1])
   .interpolator(d3.interpolatePuRd);

let maleFemaleColor = d3.scaleSequential().domain([0,1])
    .interpolator(d3.interpolateRdBu)

let caseColor = d3.scaleSequential().domain([0,1])
    .interpolator(d3.interpolatePuOr)

let courtColor = d3.scaleSequential().domain([0,1])
    .interpolator(d3.interpolatePurples)


//var myColor = d3.scaleLinear().domain([0,1])
//    .range(d3.schemeBlues[9])

sdID = "sdID"

let chartID = 1;
let button1 = document.getElementById("button1")
const legend = document.getElementById("legend")
const slider = document.getElementById("slider")
const inputSlider = document.getElementById("sliderInput")
const outputSlider = document.getElementById("sliderOutput")

let mfDataFile = "./valuesDataset/mfCount.json"
let caseDataFiles = []
for (let i = 2010; i < 2019; i++) {
    const caseFile = "./valuesDataset/cases/c" + i + ".json"
    caseDataFiles.push(caseFile)
}
let valueDatas = []
let caseData;
let caseIndex = 0;
let maxCaseIndex = caseDataFiles.length
let animationIndex = 3;
let doAnimate = 0;
let animateInterval = 0;

let titles = [
    "Male Judge Distribution",
    "Female Judge Distribution",
    "Female:Male Judge Ratio Distribution",
    "Court Count Distribution",
    "Cases Distribution",
    "Average Time per Case"
]

const selectorList = document.getElementById("selectorList")



var tooltip = d3.select("body")
.append("div")
.attr("id", "tooltip")
.text("a simple tooltip");



let bivariateColors = [
    ["#E8E8E8", "#ACE3E4", "#5AC8C8"],
    ["#DFB0D6", "#A4ADD3", "#5697B9"],
    ["#BE64AB", "#8C62AA", "#3B4994"]
]

let courtDataFile = "./valuesDataset/courtCount.json"
let districtReferenceDataFile = "./valuesDataset/idReference.json";
let stateDataFile = "./topologyDataset/indiaStates6.json";
let districtDataFile = "./topologyDataset/indiaDistricts5.json";

let inputs = [
    [mfDataFile, 0, 0],
    [mfDataFile, 0, 1],
    [mfDataFile, 0, 2],
    [courtDataFile, 0, 3],
    [caseDataFiles, 1, 4],
    [caseDataFiles, 1, 5]
]

for (let i = 0; i < titles.length; i++)
{
    let el = document.createElement("button")
    el.innerText = titles[i]
    el.val = i;
    el.onclick = (e) => {
        console.log(el.val)
        deleteSvg();
        console.log("./legends/legend" + (el.val + 1) + ".png")
        legend.src = "./legends/legend" + (el.val + 1) + ".png"
        if (!inputs[el.val][1]) {
            loadData1(inputs[el.val][0], inputs[el.val][2])
        } else {
            loadData2(inputs[el.val][0], inputs[el.val][2])
        }
    }

    selectorList.appendChild(el)
}
loadData1(mfDataFile, 0);

// loadData2(caseDataFiles, stateDataFile, districtDataFile)

async function loadData1(valueDataFile, option) {
    const valueData = await d3.json(valueDataFile);
    const districtReferenceData = await d3.json(districtReferenceDataFile);
    const stateData = await d3.json(stateDataFile)
    const districtData = await d3.json(districtDataFile)

    makeSvg1(valueData, stateData, districtReferenceData, districtData, option);
}

async function loadData2(valueDataFile, option) {

    for ( let i = 0; i < valueDataFile.length; i++) {
        let valueYearData = await d3.json(valueDataFile[i])
        valueDatas.push(valueYearData)
    }

    console.log("hi")

    // const valueData = await d3.json(valueDataFile);
    const districtReferenceData = await d3.json(districtReferenceDataFile);
    const stateData = await d3.json(stateDataFile)
    const districtData = await d3.json(districtDataFile)
    console.log("hi")


    caseData = valueDatas[0]
    console.log(caseData)
    console.log("hi")

    makeSvg1(caseData, stateData, districtReferenceData, districtData, option);
}

function deleteSvg() {
    const svg = document.getElementsByTagName("svg")[0];

    if (svg) svg.remove();

}

function makeSvg1(valueData, stateData, districtReferenceData, districtData, option) {

    values1 = Object.values(valueData)

    if (inputs[option][1]) {
        button1.style.visibility = "visible"
        slider.style.visibility = "visible"

    } else {
        button1.style.visibility = "hidden"
        slider.style.visibility = "hidden"

    }

    // console.log(valueData)

    const maleFunction = (d) => {
        // let max1 = d3.max(values1, (d) => d["males"])
        let max1 = 200;

        let value = 0;
        if (!d.properties.ID_2 || !districtReferenceData[d.properties.ID_2] || !districtReferenceData[d.properties.ID_2][0] || !districtReferenceData[d.properties.ID_2][0][sdID] || !valueData[districtReferenceData[d.properties.ID_2][0][sdID]]) {
            value = Math.random()
        } else {
            value = valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["males"] / max1
        }
        return malesColor(value)
    }

    const femaleFunction = (d) => {
        // let max2 = d3.max(values1, (d) => d[1])
        let max1 = 130;

        let value = 0;
        if (!d.properties.ID_2 || !districtReferenceData[d.properties.ID_2] || !districtReferenceData[d.properties.ID_2][0] || !districtReferenceData[d.properties.ID_2][0][sdID] || !valueData[districtReferenceData[d.properties.ID_2][0][sdID]]) {
            value = Math.random()
        } else {
            value = valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["females"] / max1
            console.log(valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["females"])
        }
        return femalesColor(value)
    }

    const maleFemaleFunction = (d) => {

        let max1 = 1.5;

        let value = 0.5;
        if (!d.properties.ID_2 || !districtReferenceData[d.properties.ID_2] || !districtReferenceData[d.properties.ID_2][0] || !districtReferenceData[d.properties.ID_2][0][sdID] || !valueData[districtReferenceData[d.properties.ID_2][0][sdID]]) {
            value = 0.1;
        } else {
            value = (valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["females"]/valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["males"]) / max1
            // console.log(valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["females"])
            // console.log(value)
        }
        return maleFemaleColor(1-value)

    }

    const courtsFunction = (d) => {

        let max1 = 200;

        let value = 0;
        if (!d.properties.ID_2 || !districtReferenceData[d.properties.ID_2] || !districtReferenceData[d.properties.ID_2][0] || !districtReferenceData[d.properties.ID_2][0][sdID] || !valueData[districtReferenceData[d.properties.ID_2][0][sdID]]) {
            value = Math.random()
        } else {
            value = valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["courts"] / max1
            // console.log(valueData[districtReferenceData[d.properties.ID_2][0][sdID]]["females"])
            // console.log(value)
        }
        return courtColor(value)

    }

    const casesFunction = (d) => {

        let max1 = 20000;
        let value = 0;

        if (!d.properties.ID_2 || !districtReferenceData[d.properties.ID_2] || !districtReferenceData[d.properties.ID_2][0]|| !districtReferenceData[d.properties.ID_2][0][sdID] || !caseData[districtReferenceData[d.properties.ID_2][0][sdID]]) {
            value = Math.random()
        } else {
            // console.log(caseData[districtReferenceData[d.properties.ID_2][0][sdID]]["cases"])
            value = caseData[districtReferenceData[d.properties.ID_2][0][sdID]]["cases"] / max1
            // console.log(caseData[districtReferenceData[d.properties.ID_2][0][sdID]]["cases"])
        }

        return caseColor(value)
    }

    const averageFunction = (d) => {

        let min1 = 1000;
        let max1 = 2000;
        let value = 0;

        if (!d.properties.ID_2 || !districtReferenceData[d.properties.ID_2] || !districtReferenceData[d.properties.ID_2][0]|| !districtReferenceData[d.properties.ID_2][0][sdID] || !caseData[districtReferenceData[d.properties.ID_2][0][sdID]]) {
            value = Math.random()
        } else {
            // console.log(caseData[districtReferenceData[d.properties.ID_2][0][sdID]]["cases"])
            
            value = caseData[districtReferenceData[d.properties.ID_2][0][sdID]]["average"]
            value = Math.max(value - 1000, 0)
            
            value = value / max1
            console.log(caseData[districtReferenceData[d.properties.ID_2][0][sdID]]["average"])
        }


        return caseColor(value)
    }

    const functions = [maleFunction, femaleFunction, maleFemaleFunction, courtsFunction, casesFunction, averageFunction]

    var svg = d3.select("#graph")
        .append("svg")
        .attr("id", "chart" + chartID)
        .attr("width", w)
        .attr("height", h)

    var districts = svg.append("g")

    districts.selectAll("path")
        .data(topojson.object(districtData, districtData.objects.IND_adm2).geometries)
        .enter().append("path")
        .attr("d", path)
        // .attr("fill", "#030303")
        .attr("fill", functions[option])      

        .attr("stroke-width", "0.3px")
        .attr("stroke", "white")

        .on("mouseover", function(e, d){ tooltip.text(`${d.properties.NAME_2}`); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(e){ return tooltip.style("top", `${(e.pageY - 30)}px`).style("left", `${(e.pageX + 15)}px`);})
        .on("mouseout", function(e){ return tooltip.style("visibility", "hidden");});


    // svg.append("g")
    //     .selectAll("path")
    //     .data(topojson.object(stateData, stateData.objects.IND_adm1).geometries)
    //     .enter().append("path")
    //     .attr("d", path)
    //     .attr("fill", "transparent")
    //     .attr("stroke-width", "0.3px")
    //     .attr("stroke", "white")
    //     .append("text");

    if (inputs[option][1]) {

        function onDoAnimate(v) {

            if (v != -1) {
                caseIndex = v-1;
                animateGraph();
                doAnimate = 0;
                button1.innerText = "Play"
                clearInterval(animateInterval)
                return;

            }

            button1.style.width = "110px";
            
            if (doAnimate) {
                doAnimate = 0;
                button1.innerText = "Play"
                clearInterval(animateInterval)

            } else {
                doAnimate = 1;
                button1.innerText = "Pause"
                button1.style.width = "110px";
            }
            
            if (doAnimate) {
                animateInterval = window.setInterval(animateGraph, 1000);
            }
            
            function animateGraph() {
                console.log(caseIndex)
                caseIndex += 1
                if (caseIndex == maxCaseIndex) {
                    caseIndex = 0
                }
                caseData = valueDatas[caseIndex]

                // console.log(caseIndex, caseData)

                inputSlider.value = caseIndex
                outputSlider.textContent = 2010 + parseInt(inputSlider.value)
                
                svg.selectAll("path")
                    .data(topojson.object(districtData, districtData.objects.IND_adm2).geometries)                    .transition() // <---- Here is the transition
                    .duration(800)
                    .attr("fill", functions[option]);
            }
        
        }

        let timer = null;
        inputSlider.addEventListener("input", (event) => {
            clearTimeout(timer);

            let val = 2010 + parseInt(inputSlider.value)
            outputSlider.textContent = val
            timer = setTimeout(function() {
                onDoAnimate(val - 2010);
            }, 500);
            
        })
        

        d3.select(button1)
            .on("click", () => onDoAnimate(-1));

    }
}


