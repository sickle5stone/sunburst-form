import React, { useEffect, useRef } from "react";
import { isEqual } from "lodash/lang";
import * as d3 from "d3";
import { Button } from "@mui/material";

const partition = (data) => {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  const partition = d3.partition().size([2 * Math.PI, root.height + 1])(root);

  return partition;
};

const handleOnLastClick = (e) => {
  console.log("I'm last");

  // console.log(e.srcElement.__data__);
};

const handleHover = (e) => {
  // console.log("hovering");
  // console.log(e.relatedTarget);
  // let target = e.relatedTarget;
  // target.style("stroke", "red");
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Sunburst = (props) => {
  const svgRef = useRef();
  const prevProps = usePrevious(props);
  useEffect(() => {
    if (!isEqual(prevProps, props)) {
      renderSunburst();
    }
    // eslint-disable-next-line
  }, [props]);

  const renderSunburst = () => {
    const { data, width } = props;

    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 2)
    );

    // var color = d3
    //   .scaleOrdinal()
    //   .range([
    //     "red",
    //     "green",
    //     "blue",
    //     "#6b486b",
    //     "#a05d56",
    //     "#d0743c",
    //     "#ff8c00",
    //   ]);

    if (data) {
      document.querySelectorAll("g").forEach((node) => {
        node.remove();
      });
      const radius = width / 8;
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", [0, 0, width, width])
        .style("font", "10px sans-serif");

      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

      const root = partition(data);
      root.each((d) => (d.current = d));
      console.log("Root:", root);

      const path = g
        .append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("d", (d) => {
          return d3
            .arc()
            .startAngle((d) => {
              return d.x0;
            })
            .endAngle((d) => d.x1)
            .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius((d) => d.y0 * radius)
            .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1))(
            d.current
          );
        });

      path
        .filter((d) => d.children)
        .style("cursor", "pointer")
        .style("pointer-events", "all")
        .on("mouseover", handleHover)
        .on("click", clicked)
        .attr("id", "target");

      path
        .filter((d) => !d.children)
        .style("cursor", "pointer")
        .on("click", handleOnLastClick)
        .attr("id", "target");

      path.append("title").text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join("/")}\n${d3.format(",d")(d.value)}`
      );

      const label = g
        .append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", (d) => +labelVisible(d.current))
        .attr("transform", (d) => labelTransform(d.current))
        .text((d) => {
          return d.data.total
            ? `${d.data.name} : $${d.data.total}`
            : `$${d.data.name}`;
        });
      // .append("svg:tspan")
      // .attr("x", 0)
      // .attr("dy", "2em")
      // .text((d) => `Total: ${d.data.total}`);

      const parent = g
        .append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

      g.append("text")
        .datum(root)
        .attr("id", "mainCircleText")
        .text((d) => d.data.name)
        .attr("font-size", 40) //font size
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .on("click", clicked);

      function clicked(event, p) {
        parent.datum(p.parent || root);

        g.select("#mainCircleText").text(p.data.name);

        root.each(
          (d) =>
            (d.target = {
              x0:
                Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              x1:
                Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth),
            })
        );

        const t = g.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path
          .transition(t)
          .tween("data", (d) => {
            const i = d3.interpolate(d.current, d.target);
            return (t) => (d.current = i(t));
          })
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
          .attr("fill-opacity", (d) =>
            arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
          )
          .attrTween("d", (d) => () => {
            return d3
              .arc()
              .startAngle((d) => d.x0)
              .endAngle((d) => d.x1)
              .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
              .padRadius(radius * 1.5)
              .innerRadius((d) => d.y0 * radius)
              .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1))(
              d.current
            );
          });

        label
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
          })
          .transition(t)
          .attr("fill-opacity", (d) => +labelVisible(d.target))
          .attrTween("transform", (d) => () => labelTransform(d.current));
      }

      function arcVisible(d) {
        return d.y1 <= 4 && d.y0 >= 1 && d.x1 > d.x0;
      }

      function labelVisible(d) {
        return d.y1 <= 4 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

      function labelTransform(d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = ((d.y0 + d.y1) / 2) * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`;
      }
    }
  };

  return (
    <div id={props.keyId} className="text-center">
      <svg
        width={props.size}
        height={props.size}
        ref={svgRef}
        id={`${props.keyId}-svg`}
      ></svg>
      {/* <Button
        style={{ position: "absolute", top: "50%", left: "50%" }}
        onClick={props.handleClick}
      >
        Hello
      </Button> */}
    </div>
  );
};

export default Sunburst;
