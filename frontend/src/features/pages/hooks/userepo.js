import { useDispatch, useSelector } from "react-redux";
import {
  setRepoUrl,
  setcontent,
  reposucess
} from "../repo.slice";

import {
  createcontent,
  getrepocard,
  getrepocontent
} from "../service/card.api";

const useRepo = () => {
  const dispatch = useDispatch();
  const repo = useSelector((state) => state.repo);

  async function handlecontent(repoUrl) {
    try {
      dispatch(setRepoUrl(repoUrl));

      const res = await createcontent(repoUrl);

      dispatch(setcontent(res));
      dispatch(reposucess(repoUrl));

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function handlegetrepocard() {
    try {
      const res = await getrepocard();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function handlegetcontent(repourl) {
    try {
      const res = await getrepocontent(repourl);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return {
    handlecontent,
    handlegetcontent,
    handlegetrepocard,
    repo
  };
};

export default useRepo;