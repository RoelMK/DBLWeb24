const data = [[1, 20, 30], [20, 1, 60], [30, 60, 1]];

/**
 * Prepares the input data for Plotly
 * @param {*} inputData Raw data from @Julian
 * @returns Input for Plotly
 */
function createPlotlyVisualizationInput(inputData) {
  return [
    {
      z: convertData(inputData),
      type: 'heatmap'
    }
  ]
}

/**
 * Converts raw data from @Julian into usuable data for Plotly.
 * @param {*} dataToConvert Raw data from @Julian  TODO: what is the data type of the input data going to be?
 * @returns Converted data
 */
function convertData(dataToConvert) {
  return dataToConvert;   // TODO: implement conversion function
}