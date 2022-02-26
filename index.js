(async function getData() {
    let res = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    let dataset = await res.json()

    const margin = { top: 50, bottom: 50, left: 50, right: 50 }
    const width = 900;
    const height = 600;

    let svg = d3.select(".container")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("viewbox", [0, 0, width, height])

    let xTime = d3.scaleTime()
        .domain([new Date(d3.min(dataset, d=>d["Year"])-1, 0), new Date(d3.max(dataset, d=>d["Year"])+1, 0)])
        .range([margin.left, width - margin.right])

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xTime).tickFormat(d3.utcFormat("%Y")))

    let yScale = d3.scaleTime()
        .domain([new Date(dataset[dataset.length-1]["Seconds"]*1000), new Date(dataset[0]["Seconds"]*1000)])
        .range([height - margin.bottom, margin.top])

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale).tickFormat(d3.utcFormat("%M:%S")))

    let tooltip = d3.select(".container")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", "0")

    let mouseover = (event, data) => {
        return tooltip
            .style("top", (event.clientY) + "px")
            .style("left", (event.clientX) + "px")
            .style("opacity", "1")
            .attr("data-year", data["Year"])
            .html(`${data["Name"]}: ${data["Nationality"]}<br>Year: ${data["Year"]}, Time: ${data["Time"]}`)
    }

    let mouseleave = (d) => tooltip.style("opacity", "0")

    svg.append('g')
        .selectAll("dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", d => d["Year"])
        .attr("data-yvalue", d => new Date(d["Seconds"]*1000).toISOString())
        .attr("fill", d => d["Doping"] ? "steelblue" : "orange")
        .attr("cx", d => xTime(new Date(d["Year"], 0)))
        .attr("cy", d => yScale(new Date(d["Seconds"]*1000)))
        .attr("r", 5)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
    

    let legend = svg.append("g")
        .attr("id", "legend")

    let group1 = legend.append("g")
        .attr("class", "legend-label")

    group1.append("text")
        .attr("text-anchor", "end")
        .attr("x", width-margin.right)
        .attr("y", 300)
        .text("No doping allegations")

    group1.append("rect")
        .attr("fill", "orange")
        .attr("x", width-margin.right+5)
        .attr("y", 290)
        .attr("width", 10)
        .attr("height", 10)
        .text("No doping allegations")


    let group2 = legend.append("g")
        .attr("class", "legend-label")

    group2.append("text")
        .attr("text-anchor", "end")
        .attr("x", width-margin.right)
        .attr("y", 320)
        .text("Riders with doping allegations")

    group2.append("rect")
        .attr("fill", "steelblue")
        .attr("x", width-margin.right+5)
        .attr("y", 310)
        .attr("width", 10)
        .attr("height", 10)
        .text("No doping allegations")

    svg.node()
})()