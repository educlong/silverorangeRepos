/* eslint-disable @typescript-eslint/naming-convention */
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {
  allLanguages,
  noLanguages,
  RepoBtns,
  TableCellLanguageHeader,
  TableRowRepos,
  useStyles,
} from './ReposHandle';
import { Repo } from '../models/Repo';
import { DetailRepo } from './DetailRepo';
import axios from 'axios';

//--------------- createContext, Context & ContextProvider ---------------------
//1. Fetch repository data from the Express API created in (A).
const reposDefault = {
  repos: [],
};
export const ReposContext = createContext<{ repos: Repo[] }>(reposDefault);
export const ReposContextProvider = ({ children }: { children: ReactNode }) => {
  const [repos, setRepos] = useState<Repo[]>(reposDefault.repos);

  useEffect(() => {
    axios.get('http://localhost:4000/repos').then((responseJSON) => {
      setRepos(responseJSON.data.body);
    });
  }, []);
  return (
    <ReposContext.Provider value={{ repos }}>{children}</ReposContext.Provider>
  );
};

//--------------- main Component ---------------------
export const Repos = () => {
  const { repos } = useContext(ReposContext); //get all repos
  const [language, setLanguage] = useState(allLanguages);
  const [openDialog, setOpenDialog] = useState(false);

  //3. The list of repositories should be displayed in reverse chronological order by creation date.
  const reposByCreateDate = repos.sort(
    (re1, re2) => Date.parse(re2.created_at) - Date.parse(re1.created_at)
  );

  //list of languages (remove duplicated languages)
  const _languages: string[] = [];
  repos?.forEach((repo) => {
    _languages.push(repo.language);
  });
  const _languages_ = _languages.filter((lang, index) => {
    return _languages.indexOf(lang) === index;
  });

  //stores the selected repo
  const [repoSelected, setRepoSelected] = useState<Repo>({} as Repo);
  //styles
  const classes = useStyles();
  return (
    <Box>
      <RepoBtns /**4. List of button for a list of languages */
        _languages_={_languages_}
        language={language}
        setLanguage={setLanguage}
      />
      {/**2. TABLE to display a list if respositories*/}
      <Box display="flex" justifyContent="center" my={5}>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>
                  <TableCellLanguageHeader
                    _languages_={_languages_}
                    language={language}
                    setLanguage={setLanguage}
                  />
                </TableCell>
                <TableCell align="right">Forks Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reposByCreateDate.map((repo, index) =>
                repo.language === language ||
                language === allLanguages ||
                (repo.language === null && language === noLanguages) ? (
                  <TableRowRepos
                    key={index}
                    repo={repo}
                    setLanguage={setLanguage}
                    setOpenDialog={setOpenDialog}
                    setRepoSelected={setRepoSelected}
                  />
                ) : (
                  ''
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>{' '}
      {/**end TABLE */}
      {/**DIALOG to display the most recent commit date, author, and message */}
      <DetailRepo
        repo={repoSelected}
        isOpen={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </Box>
  );
};
