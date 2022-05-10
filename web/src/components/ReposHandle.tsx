/* eslint-disable @typescript-eslint/naming-convention */
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Repo } from '../models/Repo';
import {
  Box,
  MenuItem,
  Select,
  Button,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const _allLanguages = 'All Languages';
export const allLanguages = 'Languages';
export const noLanguages = 'No Language';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    languageStyle: {
      borderBottom: '1px solid black',
    },
    btnLanguage: {
      marginRight: '1rem',
    },
    tableRowClick: {
      cursor: 'pointer',
    },
  })
);

//--------------- RepoBtn Component ---------------------
//button for a language
const RepoBtn = ({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.btnLanguage}
      variant="contained"
      onClick={() =>
        language === null
          ? setLanguage(noLanguages)
          : language === _allLanguages
          ? setLanguage(allLanguages)
          : setLanguage(language)
      }
    >
      {language === null ? noLanguages : language}
    </Button>
  );
};

//--------------- RepoBtns Component ---------------------
//button for a list of languages
export const RepoBtns = ({
  _languages_,
  language,
  setLanguage,
}: {
  _languages_: string[];
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Box display="flex" justifyContent="center" my={5}>
      <RepoBtn language={_allLanguages} setLanguage={setLanguage} />
      {_languages_.map((lang, index) =>
        lang !== language ? (
          <RepoBtn key={index} language={lang} setLanguage={setLanguage} />
        ) : (
          ''
        )
      )}
    </Box>
  );
};

//--------------- TableCellLanguageHeader Component ---------------------
//header for TableCell "Languages"
export const TableCellLanguageHeader = ({
  _languages_,
  language,
  setLanguage,
}: {
  _languages_: string[];
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}) => {
  const classes = useStyles();
  return (
    /**4. list of languages in Menu Selection */
    <Select
      className={classes.languageStyle}
      value={language}
      onChange={(event: ChangeEvent<{ value: unknown }>) => {
        setLanguage(event.target.value as string);
      }}
    >
      <MenuItem value={allLanguages}>Languages</MenuItem>
      <MenuItem value={noLanguages}>No Language</MenuItem>
      {_languages_.map((_language_, index) =>
        _language_ === null ? (
          ''
        ) : (
          <MenuItem key={index} value={_language_}>
            {_language_}
          </MenuItem>
        )
      )}
    </Select>
  );
};

//--------------- TableRowRepos Component ---------------------
//body for each TableRow
//5. Make each repository in the list clickable.
export const TableRowRepos = ({
  repo,
  setLanguage,
  setOpenDialog,
  setRepoSelected,
}: {
  repo: Repo;
  setLanguage: Dispatch<SetStateAction<string>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  setRepoSelected: Dispatch<SetStateAction<Repo>>;
}) => {
  const classes = useStyles();
  return (
    <TableRow
      className={classes.tableRowClick}
      //5. Make each repository in the list clickable.
      onClick={() => {
        setOpenDialog(true);
        setRepoSelected(repo);
      }}
    >
      <TableCell>{repo.name}</TableCell>
      <TableCell>{repo.description}</TableCell>
      <TableCell>
        <RepoBtn language={repo.language} setLanguage={setLanguage} />
      </TableCell>
      <TableCell align="right">{repo.forks_count}</TableCell>
    </TableRow>
  );
};
