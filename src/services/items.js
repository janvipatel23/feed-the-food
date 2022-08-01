import axios from "axios";

const NGOService = {
  getNGOList: (api_key) => {
    return axios
      .get(
        "https://3n6o8csrpe.execute-api.us-west-2.amazonaws.com/production/verifiedngos",
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": api_key,
          },
        }
      )
      .then((response) => {
        return response;
      });
  },

  getNGO: (username) => {
    return axios
      .post(
        "https://3n6o8csrpe.execute-api.us-west-2.amazonaws.com/production/items",
        { username: username },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Headers": "*",
            // "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Methods": "*",
          },
        }
      )
      .then((response) => {
        return response;
      });
  },

  updateNGOList: (username, requirementList) => {
    return axios
      .post(
        "https://3n6o8csrpe.execute-api.us-west-2.amazonaws.com/production/updateitems",
        {
          username: username,
          updateValue: requirementList,
          updateKey: "donate",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response;
      });
  },

  updateNGOProperties: (username, updateList) => {
    return axios
      .post(
        "https://3n6o8csrpe.execute-api.us-west-2.amazonaws.com/production/updatengoproperties",
        { username: username, updateList: updateList },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response;
      });
  },

  makeDonation: (donationObject) => {
    return axios
      .post(
        "https://3n6o8csrpe.execute-api.us-west-2.amazonaws.com/production/makedonation",
        { ...donationObject }
      )
      .then((response) => {
        return response;
      });
  },
};

export default NGOService;
