import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import NavBar from '../../components/NavBar';
import StandProjectList from '../../components/StandProjectList';
import { useState } from 'react';
import { FormQuery } from '../../styles/admin/styles.module';
import { ProjectContainerList } from '../../components/StandProjectList/styles';
import api, { baseUrl } from '../../config/api';

// interface Iprojects {
//   projects: [any];
// }

export default function ListaJovem({ projects }) {
  const [projs, setProjs] = useState(projects);

  const requestAgain = (e) => {
    e.preventDefault();
    api
      .get(`${baseUrl}/project/lista/c_agrarias/${e.target[0].value}`)
      .then((res) => {
        setProjs(res.data || []);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <>
      <Head>
        <title>Ciências Agrárias FEMIC {new Date().getFullYear()}</title>
      </Head>
      <NavBar />
      <ProjectContainerList style={{ marginTop: 75 }}>
        <h1>
          Projetos <b>Ciências</b> Agrárias
        </h1>
        <FormQuery
          className="bg-slate-100 px-4 rounded py-2 gap-3"
          onSubmit={requestAgain}>
          <label className="self-center">Ano: </label>
          <input
            className="input"
            type="number"
            min={2022}
            max={new Date().getFullYear()}
            step={1}
          />
          <button>Pesquisar</button>
        </FormQuery>
        {projs.length == 0 && <span>Sem projetos para mostrar</span>}
        {projs.length > 0 && <StandProjectList projects={projs} />}
      </ProjectContainerList>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const projectData = await fetch(
    `${baseUrl}/project/lista/c_agrarias/${new Date().getFullYear() - 1}`
  );
  const project = await projectData.json();

  return {
    props: {
      projects: project,
    },
  };
};
