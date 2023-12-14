import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';

import { FormCourse } from '../../styles/admin/styles.module';
import { IQuestion } from '../../types/course';
import api from '../../config/api';

interface IProps {
  id: string;
  data: IQuestion[];
}

export default function Avaliacao({ id, data }: IProps) {
  const { register, handleSubmit, reset } = useForm();

  const alert = useAlert();

  useEffect(() => {
    if (data?.length >= 1) {
      reset({ avaliacao: data });
    }
  }, []);

  const submit = (data: any) => {
    api
      .patch(`/course/${id}`, data)
      .then((res) => {
        alert.success('Avaliação atualizada');
      })
      .catch(console.warn);
  };

  const renderQuestions = (index: number) => {
    const questaoPrefix = `avaliacao[${index}]`;
    return (
      <div key={index}>
        <div className="flex flex-col mb-2 ml-1">
          <label htmlFor={`${questaoPrefix}.enunciado`}>
            Questão {index + 1}
          </label>
          <textarea
            rows={4}
            className="rounded border"
            id={`${questaoPrefix}.enunciado`}
            placeholder="Enunciado da questão"
            {...register(`${questaoPrefix}.enunciado`)}
          />
        </div>

        {[0, 1, 2, 3].map((moduleIndex) => (
          <div key={moduleIndex} className="flex gap-2 my-2">
            <span>{String.fromCharCode(97 + moduleIndex)}&#41; </span>
            <input
              placeholder={`Resposta ${moduleIndex + 1}`}
              {...register(`${questaoPrefix}.alternativas.${moduleIndex}`)}
            />
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <label htmlFor={`${questaoPrefix}.resposta`}>Resposta correta:</label>
          <select
            id={`${questaoPrefix}.resposta`}
            className="w-16"
            {...register(`${questaoPrefix}.resposta`)}>
            {[0, 1, 2, 3].map((optionValue) => (
              <option key={optionValue} value={optionValue}>
                {String.fromCharCode(97 + optionValue)}&#41;
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <FormCourse onSubmit={handleSubmit(submit)}>
      {Array.from({ length: 10 }).map((_, index) => renderQuestions(index))}
      <input
        type="text"
        {...register('type', {
          value: 'avaliation',
        })}
        hidden
      />
      <button type="submit" className="sucess mt-2">
        Salvar
      </button>
    </FormCourse>
  );
}