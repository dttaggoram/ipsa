function lightboxlinechart(mpname) {

queue()
    .defer(d3.csv, "data/export-2014.csv")
    .defer(d3.csv, "data/export-2013.csv")
    .defer(d3.csv, "data/export-2012.csv")
.await(readlightboxlinechart)

function readlightboxlinechart(error,data14,data13,data12) {

var data2014 = data14;
var data2013 = data13;
var data2012 = data12;
var mpexpenses;

var margin = {top: 20, right: 80, bottom: 80, left: 50},
    width = window.innerWidth - 100 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height)
;

var legendOrdinal = d3.legend.color()
  .shape("path", d3.svg.symbol().type("square").size(150)())
  .shapePadding(70)
  .orient('horizontal')
  .scale(color)
  .labelAlign('middle');

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(width)
    .orient("right")
    .ticks(4);

var line = d3.svg.line()
    //.interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.costs); });

var svg = d3.select("#lightbox-line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

mp_name = mpname;

data12 = data2012.filter(function(d){ 
  return d.mp_name == mp_name
})
data12accom = data12[0].accom_spend_against_budget;
data12office = data12[0].office_costs_spend_against_budget;
data12staff = data12[0].staff_spend_against_budget;
data12ts = data12[0].ts_spend_against_budget;
data12all = data12[0].overall_total_spend;

data13 = data2013.filter(function(d){ 
  return d.mp_name == mp_name
})
data13accom = parseInt(parseFloat(data13[0].accom_spend_against_budget.replace(',',''))/parseFloat(data12[0].accom_spend_against_budget.replace(',',''))*100)-100;
data13office = parseInt(parseFloat(data13[0].office_costs_spend_against_budget.replace(',',''))/parseFloat(data12[0].office_costs_spend_against_budget.replace(',',''))*100)-100;
data13staff = parseInt(parseFloat(data13[0].staff_spend_against_budget.replace(',',''))/parseFloat(data12[0].staff_spend_against_budget.replace(',',''))*100)-100;
data13ts = parseInt(parseFloat(data13[0].ts_spend_against_budget.replace(',',''))/parseFloat(data12[0].ts_spend_against_budget.replace(',',''))*100)-100;
data13all = parseInt(parseFloat(data13[0].overall_total_spend.replace(',',''))/parseFloat(data12[0].overall_total_spend.replace(',',''))*100)-100;

data14 = data2014.filter(function(d){ 
  return d.mp_name == mp_name
})
data14accom = parseInt(parseFloat(data14[0].accom_spend_against_budget.replace(',',''))/parseFloat(data12[0].accom_spend_against_budget.replace(',',''))*100)-100;
data14office = parseInt(parseFloat(data14[0].office_costs_spend_against_budget.replace(',',''))/parseFloat(data12[0].office_costs_spend_against_budget.replace(',',''))*100)-100;
data14staff = parseInt(parseFloat(data14[0].staff_spend_against_budget.replace(',',''))/parseFloat(data12[0].staff_spend_against_budget.replace(',',''))*100)-100;
data14ts = parseInt(parseFloat(data14[0].ts_spend_against_budget.replace(',',''))/parseFloat(data12[0].ts_spend_against_budget.replace(',',''))*100)-100;
data14all = parseInt(parseFloat(data14[0].overall_total_spend.replace(',',''))/parseFloat(data12[0].overall_total_spend.replace(',',''))*100)-100;

mpexpenses = [
{date:"20130331", Accommodation:"0", Office:"0", Staff:"0", Travel:"0", All:"0", data:data12}, 
{date:"20140331", Accommodation:data13accom, Office:data13office, Staff:data13staff, Travel:data13ts, All:data13all, data:data13}, 
{date:"20150331", Accommodation:data14accom, Office:data14office, Staff:data14staff, Travel:data14ts, All:data13all,  data:data14}]

data = mpexpenses;
console.log(data);
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date" && key !== "data"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var expenses = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, costs: +d[name], amount: "£50,000"};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(expenses, function(c) { return d3.min(c.values, function(v) { return v.costs; }); }),
    d3.max(expenses, function(c) { return d3.max(c.values, function(v) { return v.costs; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis bottom")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis.ticks(d3.time.years).tickSize(0));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + Y0() + ")")
      .call(xAxis.ticks(0).tickSize(0));

  var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);


    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -20)
      .attr("dy", "-.71em")
      .style("text-anchor", "end")
      .text("% Change");

  gy.selectAll("g").filter(function(d){ return d !=0; })
    .classed("minor", true);

  gy.selectAll("text")
    .attr("x", 4)
    .attr("dy", -4);

  var expense = svg.selectAll(".expense")
      .data(expenses)
    .enter().append("g")
      .attr("class", "expense");

  expense.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
        .on('mousemove', function(d,i){
            var mouse = d3.mouse(svg.node()).map(
                function (d) {
                    return parseInt(d);
                }
            )
            ;
console.log(d)
            tooltip
                .classed('hidden', false)
                .attr('style', 'left:' + (mouse[0]-50) + 'px; top:' + (mouse[1]+300) + 'px')
                // tooltip text:
                .html(
                    '<b>' + d.name + '</b><br />'
                )
            
        })
        .on('mouseout', function(d,i){
            tooltip.classed('hidden', true)
        })


    svg.append("g")
      .attr("class", "legendOrdinalLineChart")
      .attr("transform", "translate("+ ((width/2)-100) +"," + (height+50) + ")")
      .call(legendOrdinal);


  function Y0() {
    return y(0);
  }

}

}