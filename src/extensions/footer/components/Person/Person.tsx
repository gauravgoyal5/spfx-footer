import * as React from 'react';
import { SiteUser } from '../../../../models/SiteUser';
import { Persona } from 'office-ui-fabric-react/lib/Persona';
import { PrincipalType } from '@pnp/sp';
import useAsyncData from '../../../../hooks/useAsyncData';
import { SiteService } from '../../../../services/SiteService';
import { toUpn } from '../../../../services/Utils';
import * as strings from 'FooterApplicationCustomizerStrings';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mgt-person': any;
    }
  }
}

export interface IPersonProps {
  user: SiteUser;
  siteService: SiteService;
}

const Person: React.FC<IPersonProps> = ({ user, siteService }) => {
  const isUser = user.principalType === PrincipalType.User;
  const isUnknown = user.principalType === 'unknown';
  const { data, isLoading, error } = useAsyncData(null, isUser ? siteService.getPersonDetails : () => {}, [ user ]);

  const renderGraphUser = () => {
    return (
      <mgt-person
        person-details={JSON.stringify(data)}
        view="twoLines"
        person-card="hover"
        show-presence="true"
      ></mgt-person>
    );
  };

  const renderNonUser = () => {
    let groupLabel = "Group";
    if (user.principalType === PrincipalType.SecurityGroup) groupLabel = "Security Group";
    if (user.principalType === PrincipalType.DistributionList) groupLabel = "Distribution List";

    return (
      <Persona text={user.title} secondaryText={groupLabel} />
    );
  };

  const renderBasicUser = () => {
    return (
      <Persona text={user.title || toUpn(user.loginName)} secondaryText={user.email} />
    );
  };

  const renderUnknown = () => {
    return (
      <Persona text={toUpn(user.loginName)} secondaryText={strings.UnknownUserLabel} imageInitials="?" />
    );
  };

  return (
    <div style={{ minHeight: 48 }}>
      {isUnknown
        ? renderUnknown()
        : isUser
          ? !isLoading && data && data.id
            ? renderGraphUser()
            : renderBasicUser()
          : renderNonUser()
      }
    </div>
  );
};

export default Person;
