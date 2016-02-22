
function plot_pie_chart(data,graph_details){
  console.log("we are inside the plotting the pie chart");
  console.log(data);
  var element = document.getElementById("graph-container");
  console.log(element.clientWidth);

  var width = (0.9*parseInt(element.clientWidth)) ,
      height = 470,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - radius);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d["recommendCount"]; });

  var svg = d3.select("#graph1").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // d3.csv("data.csv", type, function(error, data) {
  //   if (error) throw error;

    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path").transition()
    .delay(500)
        .attr("d", arc)
        .style("fill", function(d) { return color( d.data._id.primaryGroupByField); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d["data"]["_id"]["primaryGroupByField"]}).attr("font-size",15);
  //});

  function type(d) {
    d.recommendCount = +d.recommendCount;
    return d;
  }
}



function plot_multibar_graph(data,graph_details){
  console.log("plot_multibar",data);
  var element = document.getElementById("graph-container");
  console.log(element.clientWidth);
  var margin = {top: 20, right: 60, bottom: 80, left: 60},
      width = (0.9*parseInt(element.clientWidth))  - margin.left - margin.right,
      height =  470 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

 var grouped_data=graph_details["secondaryGroupByField"]["name"];

  var svg = d3.select("#graph1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //if (error) throw error;

    var ageNames = d3.keys(data[0]).filter(function(key) { return (key !== "x_dim")&&(key !== "ages")&&(key !== "total"); });
    console.log("agenames"+ageNames);

    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d["x_dim"]; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
          //.attr("transform", "rotate(-90)")
          .attr("font-size",15)
          .attr("y", 10)
          .attr("x",850)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(graph_details["primaryGroupByField"]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("font-size",15)
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size",15)
        .text(graph_details["measure"]);

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "state")
        .attr("transform", function(d) { return "translate(" + x0(d["x_dim"]) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
      .enter().append("rect")
        .transition()
        .delay(500)
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(ageNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

}
