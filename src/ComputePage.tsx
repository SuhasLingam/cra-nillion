import React, { useEffect, useState } from 'react';
import GenerateUserKey from './nillion/components/GenerateUserKey';
import CreateClient from './nillion/components/CreateClient';
import * as nillion from '@nillion/client-web';

import { NillionClient, NadaValues } from '@nillion/client-web';
import StoreSecretForm from './nillion/components/StoreSecretForm';
import StoreProgram from './nillion/components/StoreProgramForm';
import ComputeForm from './nillion/components/ComputeForm';
import ConnectionInfo from './nillion/components/ConnectionInfo';

export default function Main() {
  const programName = 'guess_game_program';
  const outputName = 'guess_game_output';

  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [computeResult, setComputeResult] = useState<string | null>(null);

  const [gamemakerSecrets, setGamemakerSecrets] = useState<string[]>(Array(3).fill(null));
  const [guessPositionRow, setGuessPositionRow] = useState<string | null>(null);
  const [guessPositionCol, setGuessPositionCol] = useState<string | null>(null);
  const [guessSecretValue, setGuessSecretValue] = useState<string | null>(null);
  const [currentRowIterator, setCurrentRowIterator] = useState<string | null>(null);
  const [currentColIterator, setCurrentColIterator] = useState<string | null>(null);

  useEffect(() => {
    if (userkey && client) {
      const gamemakerId = client.user_id;
      const guesserId = client.user_id;
    }
  }, [userkey, client]);

  const handleSecretStored = (index: number, storeId: string) => {
    const updatedSecrets = [...gamemakerSecrets];
    updatedSecrets[index] = storeId;
    setGamemakerSecrets(updatedSecrets);
  };

  return (
    <div>
      <h1>Guessing Game</h1>
      <p>
        Connect to Nillion with a user key, then follow the steps to store the board, make a guess, and compute the results.
      </p>
      <ConnectionInfo client={client} userkey={userkey} />

      <h1>1. Connect to Nillion Client {client && ' ✅'}</h1>
      <GenerateUserKey setUserKey={setUserKey} />
      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}
      <br />

      <h1>2. Store Program {programId && ' ✅'}</h1>
      {client && (
        <StoreProgram
          nillionClient={client}
          defaultProgram={programName}
          onNewStoredProgram={(program) => setProgramId(program.program_id)}
        />
      )}
      <br />

      <h1>3. Store Board Values</h1>
      {gamemakerSecrets.map((secret, index) => (
        <div key={index}>
          <h2>Board Value {index + 1} {secret && ' ✅'}</h2>
          {client && programId && (
            <StoreSecretForm
              secretName={`board_r${Math.floor(index / 5)}_c${index % 5}`}
              onNewStoredSecret={(storedSecret) => handleSecretStored(index, storedSecret.storeId)}
              nillionClient={client}
              secretType="SecretInteger"
              isLoading={false}
              itemName=""
              hidePermissions
              defaultUserWithComputePermissions={client.user_id!}
              defaultProgramIdForComputePermissions={programId}
            />
          )}
        </div>
      ))}
      <br />

      <h1>4. Store Guess</h1>
      <div>
        <h2>Guess Position Row {guessPositionRow && ' ✅'}</h2>
        {client && programId && (
          <StoreSecretForm
            secretName="guess_position_row"
            onNewStoredSecret={(storedSecret) => setGuessPositionRow(storedSecret.storeId)}
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={client.user_id!}
            defaultProgramIdForComputePermissions={programId}
          />
        )}
      </div>
      <div>
        <h2>Guess Position Column {guessPositionCol && ' ✅'}</h2>
        {client && programId && (
          <StoreSecretForm
            secretName="guess_position_col"
            onNewStoredSecret={(storedSecret) => setGuessPositionCol(storedSecret.storeId)}
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={client.user_id!}
            defaultProgramIdForComputePermissions={programId}
          />
        )}
      </div>
      <div>
        <h2>Guess Secret Value {guessSecretValue && ' ✅'}</h2>
        {client && programId && (
          <StoreSecretForm
            secretName="guess_secret_value"
            onNewStoredSecret={(storedSecret) => setGuessSecretValue(storedSecret.storeId)}
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={client.user_id!}
            defaultProgramIdForComputePermissions={programId}
          />
        )}
      </div>
      <br />

      <h1>5. Store Iterators</h1>
      <div>
        <h2>Current Row Iterator {currentRowIterator && ' ✅'}</h2>
        {client && programId && (
          <StoreSecretForm
            secretName="public_integer_current_row_iterator"
            onNewStoredSecret={(storedSecret) => setCurrentRowIterator(storedSecret.storeId)}
            nillionClient={client}
            secretType="PublicInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={client.user_id!}
            defaultProgramIdForComputePermissions={programId}
          />
        )}
      </div>
      <div>
        <h2>Current Column Iterator {currentColIterator && ' ✅'}</h2>
        {client && programId && (
          <StoreSecretForm
            secretName="public_integer_current_col_iterator"
            onNewStoredSecret={(storedSecret) => setCurrentColIterator(storedSecret.storeId)}
            nillionClient={client}
            secretType="PublicInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={client.user_id!}
            defaultProgramIdForComputePermissions={programId}
          />
        )}
      </div>
      <br />

      <h1>6. Compute Result</h1>
      {client && programId && gamemakerSecrets.every(Boolean) && guessPositionRow && guessPositionCol && guessSecretValue && currentRowIterator && currentColIterator && (
        <ComputeForm
          nillionClient={client}
          programId={programId}
          outputName={outputName}
          onComputeProgram={(result: string) => setComputeResult(result)}
          inputs={{
            guess_position_row: guessPositionRow,
            guess_position_col: guessPositionCol,
            guess_secret_value: guessSecretValue,
            public_integer_current_row_iterator: currentRowIterator,
            public_integer_current_col_iterator: currentColIterator,
            ...gamemakerSecrets.reduce((acc, secret, index) => {
              acc[`board_r${Math.floor(index / 5)}_c${index % 5}`] = secret;
              return acc;
            }, {} as { [key: string]: string }),
          }}
        />
      )}
      <br />

      <h1>Result</h1>
      {computeResult && <p>{computeResult}</p>}
    </div>
  );
}
