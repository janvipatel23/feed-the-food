import NGOService from "../../services/items";

/**
 * Action for getting the NGO requirement list
 */
export const getNGO = (username) => {
  return NGOService.getNGO(username).then((response) => {
    return response;
  });
};

/**
 * Action for updating the NGO requirement list
 */
export const upateNGORequirementList = (username, requirementList) => {
  return NGOService.updateNGOList(username, requirementList).then(
    (response) => {
      return response;
    }
  );
};

/**
 * Updating NGO properties.
 */
export const updateNGOProperties = (username, updateList) => {
  return NGOService.updateNGOProperties(username, updateList).then(
    (response) => {
      return response;
    }
  );
};

export const getNGOList = (api_key) => {
  return NGOService.getNGOList(api_key).then((res) => res);
};

export const makeDonation = (donationObject) => {
  return NGOService.makeDonation(donationObject).then((response) => {
    return response;
  });
};
