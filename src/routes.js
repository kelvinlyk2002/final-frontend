import Dashboard from "layouts/dashboard";
import Gallery from "layouts/gallery";
import Details from "layouts/details";
import Initiation from "layouts/initiation";
import CommunityAction from "layouts/community-action";
import SearchReseult from "layouts/search-result";
import ContributionHistory from "layouts/contributionHistory";
import VotingHistory from "layouts/votingHistory";
import Faucet from "layouts/faucet";

// Soft UI Dashboard React icons
import Icon from "@mui/material/Icon";

const routes = [
  // selectable pages on sidenav
  {
    type: "collapse",
    name: "Projects Gallery",
    key: "gallery",
    route: "/gallery",
    icon: <Icon fontSize="small" color="inherit">collections</Icon>,
    component: <Gallery />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Icon fontSize="small" color="inherit">dashboard</Icon>,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Faucet",
    key: "faucet",
    route: "/faucet",
    icon: <Icon fontSize="small" color="inherit">opacity</Icon>,
    component: <Faucet />,
    noCollapse: true,
  },
  // hidden pages
  {
    key: "details",
    route: "/details",
    component: <Details />,
  },
  {
    key: "communityAction",
    route: "/communityAction",
    component: <CommunityAction />,
  },
  {
    key: "initiation",
    route: "/initiation",
    component: <Initiation />,
  },
  {
    key: "searchResult",
    route: "/searchResult",
    component: <SearchReseult />,
  },
  {
    key: "line-view",
    route: "/contributionHistory",
    component: <ContributionHistory />,
  },
  {
    key: "line-view",
    route: "/votingHistory",
    component: <VotingHistory />,
  },
];

export default routes;
