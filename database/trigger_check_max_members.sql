-- Trigger to check if the limit of members in organization is reached
-- If it is, the add is impossible

CREATE OR REPLACE FUNCTION pc_check_max_members_orga() RETURNS trigger AS $$
DECLARE 
    v_MemberCount INTEGER;
    c_MaxMemberCount INTEGER;
BEGIN
    c_MaxMemberCount := 9;

    SELECT COUNT(1) INTO v_MemberCount
    FROM involve 
    WHERE organization_id = NEW.organization_id;

    IF v_MemberCount >= c_MaxMemberCount THEN
        RAISE EXCEPTION 'Too many members !';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_check_max_members_orga 
BEFORE INSERT ON involve
FOR EACH ROW
EXECUTE PROCEDURE pc_check_max_participants();